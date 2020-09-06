import { getAllByPlaceholderText } from "@testing-library/react";

export interface Flatten {
  type: string;
  inputShape: string;
  index: number;
}

export interface conv1d {
  type: string;
  index: number;
}

export interface Dense {
  type: string;
  size: string;
  activation: string;
  index: number;
}
