import { v } from 'convex/values'

import { Doc, Id } from './_generated/dataModel'
import { mutation, query } from './_generated/server'

export const archive = mutation({
  args: {
    id: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrError(ctx)

    await getDocumentOrError(ctx, args)

    const recursiveArchive = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) =>
          q.eq('userId', userId).eq('parentDocument', documentId)
        )
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        })

        await recursiveArchive(child._id)
      }
    }

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    })

    await recursiveArchive(args.id)

    return document
  },
})

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrError(ctx)

    return await ctx.db
      .query('documents')
      .withIndex('by_user_parent', (q) =>
        q.eq('userId', userId).eq('parentDocument', args.parentDocument)
      )
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect()
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrError(ctx)

    return await ctx.db.insert('documents', {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    })
  },
})

export const getTrash = query({
  handler: async (ctx) => {
    const userId = await getUserIdOrError(ctx)

    return await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), true))
      .order('desc')
      .collect()
  },
})

export const restore = mutation({
  args: {
    id: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrError(ctx)

    const existing = await getDocumentOrError(ctx, args)

    const recursiveRestore = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) =>
          q.eq('userId', userId).eq('parentDocument', documentId)
        )
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        })

        await recursiveRestore(child._id)
      }
    }

    const options: Partial<Doc<'documents'>> = {
      isArchived: false,
    }

    if (existing.parentDocument) {
      const parent = await ctx.db.get(existing.parentDocument)

      if (parent?.isArchived) {
        options.parentDocument = undefined
      }
    }

    const document = await ctx.db.patch(args.id, options)

    await recursiveRestore(args.id)

    return document
  },
})

export const remove = mutation({
  args: {
    id: v.id('documents'),
  },
  handler: async (ctx, args) => {
    await getDocumentOrError(ctx, args)

    // const recursiveRemove = async (documentId: Id<'documents'>) => {
    //   const children = await ctx.db
    //     .query('documents')
    //     .withIndex('by_user_parent', (q) =>
    //       q.eq('userId', userId).eq('parentDocument', documentId)
    //     )
    //     .collect()
    //
    //   for (const child of children) {
    //     await ctx.db.delete(child._id)
    //
    //     await recursiveRemove(child._id)
    //   }
    // }

    return await ctx.db.delete(args.id)
  },
})

export const getSearch = query({
  handler: async (ctx) => {
    const userId = await getUserIdOrError(ctx)

    return await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect()
  },
})

export const getById = query({
  args: {
    id: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.id)

    if (!document) {
      throw new Error('Not found')
    }

    if (document.isPublished && !document.isArchived) {
      return document
    }

    const userId = await getUserIdOrError(ctx)

    if (document.userId !== userId) {
      throw new Error('Unauthorized')
    }

    return document
  },
})

export const update = mutation({
  args: {
    id: v.id('documents'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args

    await getDocumentOrError(ctx, args)

    return await ctx.db.patch(id, {
      ...rest,
    })
  },
})

export const removeIcon = mutation({
  args: {
    id: v.id('documents'),
  },
  handler: async (ctx, args) => {
    await getDocumentOrError(ctx, args)

    return await ctx.db.patch(args.id, {
      icon: undefined,
    })
  },
})

export const removeCoverIcon = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    await getDocumentOrError(ctx, args)

    return await ctx.db.patch(args.id, {
      coverImage: undefined,
    })
  },
})

/**
 * Get the user ID from the current request or throw an error if the user is not authenticated.
 * @param ctx
 * @returns {Promise<string>} The user ID.
 * @throws {Error} If the user is not authenticated.
 */
const getUserIdOrError = async (ctx: any): Promise<string> => {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) {
    throw new Error('Unauthorized')
  }

  return identity.subject
}

/**
 * Get the document from the database or throw error if the document is not found or if user is not authenticated
 * @param ctx
 * @param args
 * @returns {Promise<Doc<'documents'>>} The requested document
 * @throws {Error} If the user is not authenticated or document is not found.
 */
const getDocumentOrError = async (
  ctx: any,
  args: any
): Promise<Doc<'documents'>> => {
  const userId = await getUserIdOrError(ctx)
  const document = await ctx.db.get(args.id)

  if (!document) {
    throw new Error('Not found')
  }

  if (document.userId !== userId) {
    throw new Error('Unauthorized')
  }

  return document
}
