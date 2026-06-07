/**
 * Type definitions mirroring the SNBP-AI backend DTOs.
 * Source of truth: com.snbp.dto.* in the Spring Boot project.
 */

export type AccessLevel = "FREE" | "PREMIUM";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
}

export interface UserResponse {
  id: number;
  email: string;
  access: AccessLevel;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubTest {
  id: number;
  name: string;
  code: string;
  description: string | null;
  topicId: number;
  topicName: string;
  topicCode: string;
}

export interface Topic {
  id: number;
  name: string;
  code: string;
  description: string | null;
  subTests: SubTest[];
}

export interface QuestionOption {
  id: number;
  optionKey: string; // A–E
  content: string;
  imageUrl: string | null;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  subTestId: number;
  subTestName: string;
  subTestCode: string;
  topicId: number;
  topicName: string;
  content: string;
  imageUrl: string | null;
  difficulty: Difficulty;
  explanation: string | null;
  source: string | null;
  year: number | null;
  options: QuestionOption[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
