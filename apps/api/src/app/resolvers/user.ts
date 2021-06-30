import argon2 from 'argon2';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';

import { ApiContext } from '@notreddit/api-types';

import { User } from '../entities/User';

@InputType()
class UserInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: 'LOGIN' | 'REGISTER';

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  // Returns current user
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: ApiContext): Promise<User> {
    const userId = req.session.userId;
    if (!userId) return null;
    const user = await User.findOne({ id: userId });
    return user;
  }

  // Register
  @Mutation(() => UserResponse)
  async register(
    @Arg('input', () => UserInput) { username, password }: UserInput,
    @Ctx() { req }: ApiContext
  ): Promise<UserResponse> {
    const errors: FieldError[] = [];

    // Validate username
    username = username.trim();

    if (username.toLowerCase().length < 3)
      errors.push({
        field: 'REGISTER',
        message: 'Username must be at least 3 characters!',
      });

    const findUser = await User.findOne({
      username: username.toLowerCase(),
    });

    if (findUser)
      errors.push({
        field: 'REGISTER',
        message: 'Username exists!',
      });

    // Validate password
    if (password.length < 6)
      errors.push({
        field: 'REGISTER',
        message: 'Password must be at least 6 characters!',
      });

    const usernameInPasswordRegex = new RegExp(username, 'i');
    if (usernameInPasswordRegex.test(password))
      errors.push({
        field: 'REGISTER',
        message: 'Username cannot be used in password!',
      });

    // If there are errors
    if (errors.length > 0) return { errors };

    const hashedPass = await argon2.hash(password);

    const user = await User.create({ username, password: hashedPass }).save();

    req.session.userId = user.id;

    return { errors, user };
  }

  // Login
  @Mutation(() => UserResponse)
  async login(
    @Arg('input', () => UserInput) { username, password }: UserInput,
    @Ctx() { req }: ApiContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ username });

    // If user doesn't exist
    if (!user) {
      return {
        errors: [
          {
            field: 'LOGIN',
            message: 'Invalid Login Information!',
          },
        ],
      };
    }

    const isValidPass = await argon2.verify(user.password, password);

    // If password is invalid
    if (!isValidPass) {
      return {
        errors: [
          {
            field: 'LOGIN',
            message: 'Invalid Login Information!',
          },
        ],
      };
    }

    req.session.userId = user.id;

    // If valid
    return {
      user,
    };
  }
}
