import { TestInfo } from "@playwright/test";
import { randomBytes } from "crypto";

export function generateRandomString(minlength = 8, maxlength = 100) {
    const length = Math.floor(Math.random() * (maxlength-(minlength-1))) + minlength; // Random length between 8 and 100
    const numbers = '0123456789';
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const specialCharacters = '!@#$%^&*()-_=+[]{}|;:,.<>?/~`"\'\\';
  
    let result = '';
  
    // Ensure at least two numbers
    for (let i = 0; i < 2; i+=1) {
      result += numbers[Math.floor(Math.random() * numbers.length)];
    }
  
    // Ensure at least one uppercase letter
    result += uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
  
    // Ensure at least one lowercase letter
    result += lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
  
    // Generate remaining characters
    for (let i = 0; i < length - 4; i+=1) {
      const charSet = numbers + uppercaseLetters + lowercaseLetters + specialCharacters;
      result += charSet[Math.floor(Math.random() * charSet.length)];
    }
  
    return result;
  }

  export function randomSmallFile(name: string = 'testfile.txt') {
    return {
        name,
        mimeType: 'text/plain',
        buffer: Buffer.from(generateRandomString(50,1000)),
      }
}
  export function randomLargeFile(name: string = 'testfile.txt', size: number = 49) {
    return {
        name,
        mimeType: 'text/plain',
        buffer: randomBytes(size * 1000000),
      }
}

export const configureSnapshotPath =
  () =>
  (testInfo: TestInfo): any => {
    const originalSnapshotPath = testInfo.snapshotPath;

    // eslint-disable-next-line no-param-reassign
    testInfo.snapshotPath = (snapshotName) => {
      const result = originalSnapshotPath
        .apply(testInfo, [snapshotName])
        .replace(".txt", ".json")
        .replace("-chromium", "")
        .replace("-linux", "")
        .replace("-darwin", "");

      return result;
    };
  };