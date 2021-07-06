import argon2 from 'argon2';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { ApiContext } from '@notreddit/api-types';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { FieldError, UserInput, UserResponse } from '@notreddit/types';

import { User } from '../entities/User';
import { cookieName } from '@notreddit/api-constants';

@Resolver()
export class UserResolver {
  // Returns current user
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: ApiContext): Promise<User | undefined> {
    const userId = req.session.userId;
    if (!userId) return undefined;
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
        field: 'USERNAME',
        message: 'Username must be at least 3 characters!',
      });

    const findUser = await User.findOne({
      username: username.toLowerCase(),
    });

    if (findUser)
      errors.push({
        field: 'USERNAME',
        message: 'Username exists!',
      });

    // Validate password
    if (password.length < 6)
      errors.push({
        field: 'PASSWORD',
        message: 'Password must be at least 6 characters!',
      });

    const usernameInPasswordRegex = new RegExp(username, 'i');
    if (usernameInPasswordRegex.test(password))
      errors.push({
        field: 'PASSWORD',
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

  // Destroys cookie
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: ApiContext) {
    new Promise((resolve) =>
      req.session.destroy((err) => {
        if (err) {
          console.error(err);
          resolve(false);
          return;
        }
        res.clearCookie(cookieName);
        resolve(true);
      })
    );
  }
}
