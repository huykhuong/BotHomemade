// Get message author username
export const getRequesterName = (userId: string): string => {
  let name = "";

  switch (userId) {
    case "323493729488863242":
      name = "Huy bánh";
      break;
    case "161950945280786432":
      name = "Đăng Real G";
      break;
    case "320803190150922241":
      name = "Phúc Phùng";
      break;
  }

  return name;
};
