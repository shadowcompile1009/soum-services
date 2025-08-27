// @ts-nocheck
import bcrypt from 'bcrypt';
import { Document, model, Model, Schema } from 'mongoose';

export interface AdminDocument extends Document {
  emailOtp?: string;
  resetToken?: string;

  token: string;
  status: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePic: string;
  role: string;
  createdDate: Date;
  updatedDate: Date;
  lastLoginDate: Date;
  deleted_date: Date;
}

const adminSchema: Schema<AdminDocument> = new Schema<AdminDocument>({
  emailOtp: { type: String },
  resetToken: { type: String },
  token: { type: String },
  status: { type: String },
  name: { type: String },
  email: { type: String },
  password: { type: String },
  phoneNumber: { type: String },
  profilePic: { type: String },
  role: { type: String },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  lastLoginDate: { type: Date, default: Date.now },
  deleted_date: { type: Date, default: Date.now },
});

const hash = (user: AdminDocument, salt: string, next: any) => {
  bcrypt.hash(user.password, salt, (err, newHash) => {
    if (err) {
      next(err);
    }
    user.password = newHash;
    return next();
  });
};

const genSalt = (user: any, saltRounds: number, next: any) => {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      next(err);
    }
    return hash(user, salt, next);
  });
};

/**
 * Password hash middleware.
 */
adminSchema.pre('save', function (next) {
  const user = this as AdminDocument;
  // check to see if the password is changing
  if (!user.isModified('password')) {
    // move on
    next();
  }

  return genSalt(user, 10, next);
});
export const Admin: Model<AdminDocument> = model<AdminDocument>(
  'Admin',
  adminSchema,
  'admins'
);
