// @ts-nocheck
import bcrypt from 'bcrypt';
import { Document, Model, model, Schema } from 'mongoose';
import mongooseHidden from 'mongoose-hidden';

export interface RolePermission {
  id?: string;
  name?: string;
  displayName?: string;
  key?: string;
}

export interface UserRole {
  id?: string;
  name?: string;
  displayName?: string;
  canAccessAll?: boolean;
  group?: string;
  permissions?: RolePermission[];
}

export interface UserJWTTokenResponse {
  userId?: string;
  token?: string;
  refreshToken?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  isMFAEnabled?: boolean;
  roleName?: string;
  roleId?: string;
}
export interface UserJWTTokenInput {
  id: string;
  roleId?: string;
  roleName?: string;
  userName: string;
}
export interface UserListResponse {
  total: number;
  limit: number;
  offset: number;
  data: DeltaMachineUserDocument[];
}
export interface DeltaMachineNewUserInput {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  createdBy: string;
  roleId?: string;
  groupId?: string;
}
export interface DeltaMachineUserDocument extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  status: string;
  roleId: string;
  groupId: string;
  role?: any;
  token: string;
  refreshToken: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  deletedBy?: string;
}

const deltaMachineUserSchema = new Schema<DeltaMachineUserDocument>({
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String, unique: true },
  email: { type: String },
  password: { type: String },
  phoneNumber: { type: String },
  status: {
    type: String,
    enum: ['Inactive', 'Active', 'Delete'],
    default: 'Active',
  },
  token: { type: String },
  roleId: { type: String },
  groupId: { type: String },
  role: { type: Object },
  refreshToken: { type: String },
  createdBy: { type: String },
  createdAt: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  updatedAt: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  deletedBy: {
    type: String,
    default: null,
  },
});

deltaMachineUserSchema.set('toJSON', {
  virtuals: true,
});
deltaMachineUserSchema.set('toObject', {
  virtuals: true,
});

// This will remove `_id` and `__v`
deltaMachineUserSchema.plugin(mongooseHidden());

const hash = (user: DeltaMachineUserDocument, salt: string, next: any) => {
  bcrypt.hash(user.password, salt, (err, newHash) => {
    if (err) {
      next(err);
    }
    user.password = newHash;
    return next();
  });
};

const genSalt = (
  user: DeltaMachineUserDocument,
  saltRounds: number,
  next: any
) => {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      next(err);
    }
    return hash(user, salt, next);
  });
};
deltaMachineUserSchema.pre('save', function (next) {
  const user = this as DeltaMachineUserDocument;
  // check to see if the password is changing
  if (!user.isModified('password')) {
    // move on
    next();
  }

  return genSalt(user, 10, next);
});

export const DeltaMachineUser: Model<DeltaMachineUserDocument> = model(
  'DeltaMachineUsers',
  deltaMachineUserSchema,
  'DeltaMachineUsers'
);
