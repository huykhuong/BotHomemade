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
    case "734621198008451203":
      name = "Đăng Clone Trốn Gái";
      break;
    case "320803190150922241":
      name = "Phúc Phùng";
      break;
    case "220551051223367681":
      name = "Béo";
      break;
    case "251341269656272897":
      name = "Billy Wayne Tuấn Vũ";
      break;
    case "406079794296651777":
      name = "Tiến Sĩ";
      break;
    case "251340811743133696":
      name = "Hảo Vểnh";
      break;
    case "520071477098446848":
      name = "Long Bora";
      break;
    case "469438296674795533":
      name = "Người Đẹp Chụp Ảnh";
      break;
    case "257176192426180611":
      name = "Khang Darren";
      break;
    case "822130006557065306":
      name = "Hoàng Dét Gơ";
      break;
    case "165008211328368640":
      name = "K Lầy";
      break;
    case "272319726334640128":
      name = "Tuyên 1Trick TF";
      break;
    default:
      name = "1 Đứa Nào Đó";
      break;
  }

  return name;
};
