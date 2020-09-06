import { getAllByPlaceholderText } from "@testing-library/react";

export interface Flatten {
  type: string;
  inputShape: string;
}

export interface conv1d {
  type: string;
}

export interface Dense {
  type: string;
  size: string;
  activation: string;
}
