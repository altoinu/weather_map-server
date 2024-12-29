import CONSTANTS from "../constants/constants.mjs";

/**
 *
 * @param {string} envName
 * @returns ENV constant
 */
export function getENVConstants(envName) {
  for (let prop in CONSTANTS.ENV) {
    if (envName == CONSTANTS.ENV[prop].name) return CONSTANTS.ENV[prop];
  }

  // default development if no match
  return CONSTANTS.ENV.dev;
}

/**
 *
 * @param {string} contentType
 * @returns File extension
 */
export function getFileExtension(contentType) {
  switch (contentType) {
    case "image/bmp":
    case "image/x-windows-bmp":
      return ".bmp";

    case "image/gif":
      return ".gif";

    case "image/x-icon":
      return ".ico";

    case "image/jpeg":
      return ".jpg";

    case "image/png":
      return ".png";

    case "image/tiff":
    case "image/x-tiff":
      return ".tif";
  }

  return "";
}

export async function retryApiCall(apiCall, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await apiCall();
      return response; // Success!
    } catch (error) {
      console.error(
        `Attempt ${i + 1} failed. Retrying in ${delay}ms...`,
        error,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Failed after ${maxRetries} retries.`);
}
