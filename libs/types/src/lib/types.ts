import { Field, InputType, ObjectType } from 'type-graphql';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { User } from '../../../../apps/api/src/app/entities/User';

@InputType()
export class UserInput {
  @Field()
  username!: string;

  @Field()
  password!: string;
}

@ObjectType()
export class FieldError {
  @Field()
  field!: 'LOGIN' | 'USERNAME' | 'PASSWORD' | string;

  @Field()
  message!: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
