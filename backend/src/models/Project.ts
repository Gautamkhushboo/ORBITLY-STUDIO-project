// backend/src/models/Project.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  heroImage: string;
  category: string;
  tags: string[];
  year: number;
  challenge: string;
  approach: string;
  solution: string;
  outcome: string;
  services: string[];
  images: string[];
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    thumbnail: {
      type: String,
      default: '',
      trim: true,
    },
    heroImage: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2000, 'Year must be 2000 or later'],
      max: [2100, 'Year cannot exceed 2100'],
    },
    challenge: {
      type: String,
      default: '',
    },
    approach: {
      type: String,
      default: '',
    },
    solution: {
      type: String,
      default: '',
    },
    outcome: {
      type: String,
      default: '',
    },
    services: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    published: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProjectSchema.index({ published: 1, featured: 1 });
ProjectSchema.index({ category: 1, published: 1 });
ProjectSchema.index({ createdAt: -1 });

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
