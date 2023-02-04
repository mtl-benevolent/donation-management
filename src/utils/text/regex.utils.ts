export const regex = {
  hexadecimal: /^[0-9a-f]+$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  locale: /^[a-z]{2}(-[A-Z]{2})?$/,
  uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
};
