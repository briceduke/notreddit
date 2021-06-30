import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';

import { Post } from '../entities/Post';

@Resolver()
export class PostResolver {
  // Get Posts
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find();
  }

  // Get Post
  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  // Create Post
  @Mutation(() => Post)
  createPost(@Arg('content', () => String) content: string): Promise<Post> {
    return Post.create({
      content,
    }).save();
  }

  // Update Post
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('content', () => String) content: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) return null;

    if (typeof content !== 'undefined') {
      post.content = content;
      await post.save();
    }
    return post;
  }

  // Update Post
  @Mutation(() => Boolean)
  async deletePost(@Arg('id', () => Int) id: number): Promise<boolean> {
    try {
      await Post.delete(id);
      return true;
    } catch (err) {
      return false;
    }
  }
}
