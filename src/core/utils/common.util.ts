
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';


export class CommonUtil {

  public static index2Alpha(index: number): string {
    if (index < 0) {
      throw new Error('index cannot less than 0.');
    }

    let result = '';
    while (true) {
      const remain = index % 26;
      result = `${result}${ALPHABET[remain]}`;
      index = (index - remain) / 26;
      if (index === 0) {
        break;
      }
    }

    return result;
  }

  public static computeColor(col: string, amt: number) {

    var usePound = false;

    if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);

  }

  public static deepClone(obj: any): any{
    let objClone =  Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === 'object') {
      for(let key in obj){
        if (obj[key] && typeof obj[key] === 'object'){
          objClone[key] = CommonUtil.deepClone(obj[key]);
        }else{
          objClone[key] = obj[key]
        }
      }
    }
    return objClone;
  }

  public static randomAlphabet(length: number = 6): string {
    const strings = 'abcdefghijklmnopqrstuvwxyz';
    const stringArr = strings.split('');

    return new Array(length).fill(null).map(() => stringArr[(Math.random() * 27 | 0) % 26]).join('');
  }


}

