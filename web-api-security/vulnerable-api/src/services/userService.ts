import { userRepository } from "../repositories/userRepository.js";

export function listUsers() {
  return userRepository.listDirectory();
}
