import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAllInterviews = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity){
            throw new Error("Unauthorized");
        }
        return await ctx.db.query("interviews").collect();
    }
});

export const getMyInterviews = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity){
            throw new Error("Unauthorized");
        }
        return await ctx.db.query("interviews").withIndex("by_candidate_id", (q) => q.eq("candidateId", identity.subject)).collect();
    }
});

export const getInterviewByStreamCallId = query({
    args: {
        streamCallId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("interviews").withIndex("by_stream_call_id", (q) => q.eq("streamCallId", args.streamCallId)).first();
    }
});  

export const createInterview = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        startTime: v.number(),
        status: v.union(v.literal("upcoming"), v.literal("completed"), v.literal("cancelled")),
        streamCallId: v.string(),
        candidateId: v.string(),
        interviewerIds: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity){
            throw new Error("Unauthorized");
        }

        return await ctx.db.insert("interviews",{
            ...args,
        });

        
    },
});

export const updateInterviewStatus = mutation({
    args: {
        interviewId: v.id("interviews"),
        status: v.union(v.literal("upcoming"), v.literal("completed"), v.literal("cancelled")),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.interviewId, {
            status: args.status,
            ...(args.status === "completed" ? {endTime: Date.now()} : {}),
        });
    }
})