import argon2 from 'argon2';
import { Arg, Field, InputType, Mutation, Resolver } from 'type-graphql';

import { User } from '../entities/User';

@InputType()
class UserInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg('input', () => UserInput) { username, password }: UserInput
  ) {
    const hashedPass = await argon2.hash(password);

    const user = User.create({ username, password: hashedPass }).save();

    return user;
  }
}
