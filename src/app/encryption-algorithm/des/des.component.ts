import { Component, OnInit } from '@angular/core';
import * as localforage from 'localforage';

@Component({
  selector: 'app-des',
  templateUrl: './des.component.html',
  styleUrls: ['./des.component.sass']
})
export class DESComponent implements OnInit {

  constructor() { }
  ngf: LocalForage = localforage.createInstance({ name: 'encryption-algorithm', storeName: 'des' });
  secretKey: string = "";
  toBeProceessed: string = "";
  pc_1: number[] = [
    57, 49, 41, 33, 25, 17, 9,
    1, 58, 50, 42, 34, 26, 18,
    10, 2, 59, 51, 43, 35, 27,
    19, 11, 3, 60, 52, 44, 36,
    63, 55, 47, 39, 31, 23, 15,
    7, 62, 54, 46, 38, 30, 22,
    14, 6, 61, 53, 45, 37, 29,
    21, 13, 5, 28, 20, 12, 4
  ]

  pc_2: number[] = [
    14, 17, 11, 24, 1, 5,
    3, 28, 15, 6, 21, 10,
    23, 19, 12, 4, 26, 8,
    16, 7, 27, 20, 13, 2,
    41, 52, 31, 37, 47, 55,
    30, 40, 51, 45, 33, 48,
    44, 49, 39, 56, 34, 53,
    46, 42, 50, 36, 29, 32
  ];

  IP: number[] = [
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7
  ];

  E: number[] = [
    32, 1, 2, 3, 4, 5,
    4, 5, 6, 7, 8, 9,
    8, 9, 10, 11, 12, 13,
    12, 13, 14, 15, 16, 17,
    16, 17, 18, 19, 20, 21,
    20, 21, 22, 23, 24, 25,
    24, 25, 26, 27, 28, 29,
    28, 29, 30, 31, 32, 1
  ];
  S: number[][] = [
    [
      14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7,
      0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8,
      4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0,
      15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13
    ],
    [
      15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10,
      3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5,
      0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15,
      13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9
    ],
    [
      10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8,
      13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1,
      13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7,
      1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12
    ],
    [
      7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15,
      13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9,
      10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4,
      3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14
    ],
    [
      2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9,
      14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6,
      4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14,
      11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3
    ],
    [
      12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11,
      10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8,
      9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6,
      4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13
    ],
    [
      4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1,
      13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6,
      1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2,
      6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12
    ],
    [
      13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7,
      1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2,
      7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8,
      2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11
    ]
  ];
  P: number[] = [
    16, 7, 20, 21,
    29, 12, 28, 17,
    1, 15, 23, 26,
    5, 18, 31, 10,
    2, 8, 24, 14,
    32, 27, 3, 9,
    19, 13, 30, 6,
    22, 11, 4, 25
  ];
  IP_: number[] = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9, 49, 17, 57, 25
  ];
  NUM_OF_LEFT_SHIFTS: number[] = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
  subSecretKey: string[] = [];
  textArray: string[] = [];

  encrypt() {
    if (this.toBeProceessed === '' || this.secretKey === '') {
      alert(`Please input text or secretKey!`);
      return;
    }

    this.clear();
    //????????????,???utf-8?????????????????????????????????8??????
    let secretArray = new TextEncoder().encode(this.secretKey).filter((v, i, a) => {
      return ((i + 1) % Math.floor(a.length / 8)) === 0;
    }).slice(0, 8);
    this.display(`secretKey: ${this.secretKey}\n-->   ${this.array2binaryString(secretArray)}`);
    //P??????
    let secretKey_p = '';
    let secretArray_p: string[] = [];
    this.pc_1.map((v) => {
      secretKey_p += this.array2binaryString(secretArray).replace(/ /g, '')[v - 1];
    })

    for (let i = 0; i < secretKey_p.length; i = i = i + 7) {
      secretArray_p.push.apply(secretArray_p, ['0b' + secretKey_p.slice(i, i + 7)]);
    }
    //this.display(`P??????   \n-->\n${this.array2binaryString(secretArray_p)}`)
    let tempSecretKey: string[] = [];
    let C0 = secretArray_p.slice(0, 4);
    let D0 = secretArray_p.slice(4, 8);
    let prevC = C0;
    let prevD = D0;
    this.NUM_OF_LEFT_SHIFTS.map(v => {
      prevC = this.cyclicMoveBinary(prevC, v, 'l');
      prevD = this.cyclicMoveBinary(prevD, v, 'l');
      tempSecretKey.push((prevC.join('') + prevD.join('')).replace(/0b/g, ''));
    });

    this.subSecretKey = tempSecretKey.map(str => {
      let result = '';
      this.pc_2.map(v => {
        result += str[v - 1];
      })
      return result;
    });
    console.log(this.subSecretKey);


    //this.display(`subSecretKey(0->16):\n-->\n${this.subSecretKey.join('\n')}`);
    //???????????????utf-8??????,?????????64?????????,?????????0??????
    let textbuffer = new TextEncoder().encode(this.toBeProceessed);
    for (let i = 0; i < textbuffer.length; i = i + 8) {
      this.textArray.push(this.array2binaryString(textbuffer.slice(i, i + 8)).replace(/ /g, ''));
    }
    this.textArray = this.textArray.map(v => {
      if (v.length < 64) {
        let add = '0000000000000000000000000000000000000000000000000000000000000000';
        return add.slice(0, 64 - v.length) + v
      }
      return v
    })

    console.log("textArray:")
    console.log(this.textArray);

    this.textArray = this.textArray.map(text => {

      let text_IP = '';
      this.IP.map(ip => {
        text_IP += text[ip - 1];
      })
      let L0 = text_IP.slice(0, 32);
      let R0 = text_IP.slice(32, 64);
      let prevL = L0;
      let prevR = R0;
      //Ln=R(n-1);
      //Rn=L(n-1)??????P( S ( ( E ( R(n-1) ) ?????? Kn ) ) );
      for (let i = 0; i < 16; i++) {
        let prevR_E = '';
        this.E.map(e => {
          prevR_E += prevR[e - 1];
        })
        let prevR_E_Kn = this.binaryStringXorBinaryString(prevR_E, this.subSecretKey[i]);
        let tempArray = [];
        for (let i = 0; i < prevR_E_Kn.length; i = i + 6) {
          tempArray.push(prevR_E_Kn.slice(i, i + 6))
        }
        tempArray = tempArray.map((tmp, i) => {
          let x = Number('0b' + tmp[0] + tmp[5]);
          let y = Number('0b' + tmp.slice(1, 5));
          if (this.S[i][x * 16 + y].toString(2).length < 4) {
            let add = '0000';
            return add.slice(0, 4 - this.S[i][x * 16 + y]
              .toString(2).length) + this.S[i][x * 16 + y].toString(2);
          }
          return this.S[i][x * 16 + y].toString(2);
        })

        let prevR_E_Kn_S = tempArray.join('');
        let prevR_E_Kn_S_P = '';
        this.P.map(v => {
          prevR_E_Kn_S_P += prevR_E_Kn_S[v - 1];
        });
        let L = prevR;
        let R = this.binaryStringXorBinaryString(prevL, prevR_E_Kn_S_P);
        prevL = L;
        prevR = R;
      }
      let R16L16 = prevR + prevL;
      let result = '';
      this.IP_.map(v => {
        result += R16L16[v - 1];
      })
      return result
    });

    console.log(`encrypted Array:`);
    console.log(this.textArray)
    this.display(`Encrypt Successfully???`);

    let toBase64Array: number[] = [];
    for (let i = 0; i < this.textArray.join('').length; i = i + 8) {
      toBase64Array.push(Number('0b' + this.textArray.join('').slice(i, i + 8)))
    }
    let base64Str = btoa(toBase64Array.map(v => String.fromCharCode(v)).join(''));
    this.toBeProceessed = base64Str;
    return base64Str;
  }

  decrypt() {
    if (this.toBeProceessed === '' || this.secretKey === '') {
      alert(`Please input text or secretKey!`);
      return;
    }
    this.clear();
    //????????????,???utf-8?????????????????????????????????8??????
    let secretArray = new TextEncoder().encode(this.secretKey).filter((v, i, a) => {
      return ((i + 1) % Math.floor(a.length / 8)) === 0;
    }).slice(0, 8);
    this.display(`secretKey: ${this.secretKey}\n-->   ${this.array2binaryString(secretArray)}`);

    //P??????
    let secretKey_p = '';
    let secretArray_p: string[] = [];
    this.pc_1.map((v) => {
      secretKey_p += this.array2binaryString(secretArray).replace(/ /g, '')[v - 1];
    })

    for (let i = 0; i < secretKey_p.length; i = i = i + 7) {
      secretArray_p.push.apply(secretArray_p, ['0b' + secretKey_p.slice(i, i + 7)]);
    }
    //this.display(`P??????   \n-->\n${this.array2binaryString(secretArray_p)}`)
    let tempSecretKey: string[] = [];
    let C0 = secretArray_p.slice(0, 4);
    let D0 = secretArray_p.slice(4, 8);
    let prevC = C0;
    let prevD = D0;
    this.NUM_OF_LEFT_SHIFTS.map(v => {
      prevC = this.cyclicMoveBinary(prevC, v, 'l');
      prevD = this.cyclicMoveBinary(prevD, v, 'l');
      tempSecretKey.push((prevC.join('') + prevD.join('')).replace(/0b/g, ''));
    });

    this.subSecretKey = tempSecretKey.map(str => {
      let result = '';
      this.pc_2.map(v => {
        result += str[v - 1];
      })
      return result;
    });
    this.subSecretKey.reverse();
    console.log(this.subSecretKey);

    //this.display(`subSecretKey(0->16):\n-->\n${this.subSecretKey.join('\n')}`);


    //???Base64??????????????????????????????64?????????
    let tempArray = atob(this.toBeProceessed).split('').map(v => {
      if (v.charCodeAt(0).toString(2).length < 8) {
        let add = '00000000';
        return add.slice(0, 8 - v.charCodeAt(0).toString(2).length) + v.charCodeAt(0).toString(2);
      }
      return v.charCodeAt(0).toString(2);
    });

    for (let i = 0; i < tempArray.length; i = i + 8) {
      this.textArray.push(tempArray.slice(i, i + 8).join(''));
    }

    console.log("textArray:")
    console.log(this.textArray);

    this.textArray = this.textArray.map(text => {

      let text_IP = '';
      this.IP.map(ip => {
        text_IP += text[ip - 1];
      });
      let L0 = text_IP.slice(0, 32);
      let R0 = text_IP.slice(32, 64);
      let prevL = L0;
      let prevR = R0;
      //Ln=R(n-1);
      //Rn=L(n-1)??????P( S ( ( E ( R(n-1) ) ?????? Kn.reverse() ) ) );
      for (let i = 0; i < 16; i++) {
        let prevR_E = '';
        this.E.map(e => {
          prevR_E += prevR[e - 1];
        })
        let prevR_E_Kn = this.binaryStringXorBinaryString(prevR_E, this.subSecretKey[i]);
        let tempArray = [];
        for (let i = 0; i < prevR_E_Kn.length; i = i + 6) {
          tempArray.push(prevR_E_Kn.slice(i, i + 6))
        }
        tempArray = tempArray.map((tmp, i) => {
          let x = Number('0b' + tmp[0] + tmp[5]);
          let y = Number('0b' + tmp.slice(1, 5));
          if (this.S[i][x * 16 + y].toString(2).length < 4) {
            let add = '0000';
            return add.slice(0, 4 - this.S[i][x * 16 + y]
              .toString(2).length) + this.S[i][x * 16 + y].toString(2);
          }
          return this.S[i][x * 16 + y].toString(2);
        })

        let prevR_E_Kn_S = tempArray.join('');
        let prevR_E_Kn_S_P = '';
        this.P.map(v => {
          prevR_E_Kn_S_P += prevR_E_Kn_S[v - 1];
        });
        let L = prevR;
        let R = this.binaryStringXorBinaryString(prevL, prevR_E_Kn_S_P);
        prevL = L;
        prevR = R;
      }

      let R16L16 = prevR + prevL;
      let result = '';
      this.IP_.map(v => {
        result += R16L16[v - 1];
      })
      return result
    });

    console.log(`encrypt Array:`);
    console.log(this.textArray)
    this.display(`Decrypt Successfully???`);

    tempArray = [];
    for (let i = 0; i < this.textArray[this.textArray.length - 1].length; i = i + 8) {
      tempArray.push(this.textArray[this.textArray.length - 1].slice(i, i + 8));
    }

    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i] !== '00000000') {
        break;
      }
      tempArray.shift();
      i--;
    }


    let resultArray = [];
    for (let i = 0; i < this.textArray.join('').length - 64; i = i + 8) {
      resultArray.push(Number('0b' + this.textArray.join('').slice(i, i + 8)))
    }
    resultArray.push(...tempArray.map(v => { return Number('0b' + v) }))
    let result = new TextDecoder().decode(new Uint8Array(resultArray));
    this.toBeProceessed = result;
    return result;

  }
  clear() {
    document.querySelector("div>p")!.textContent = '';
    this.subSecretKey = [];
    this.textArray = [];


  }

  display(text: string) {
    console.log(text);
    let textShow = document.querySelector("div>p");
    if (textShow) {
      textShow.textContent += text + "\n"
    }

  }

  binaryStringXorBinaryString(str1: string, str2: string) {
    let str1Array: string[] = [];
    let str2Array: string[] = [];
    for (let i = 0; i < str1.length; i = i + 8) {
      str1Array.push(str1.slice(i, i + 8));
      str2Array.push(str2.slice(i, i + 8));
    }

    return str1Array.map((v, i) => {
      if ((Number('0b' + v) ^ Number('0b' + str2Array[i])).toString(2).length < 8) {
        let add = '00000000';
        return add.slice(0, 8 - (Number('0b' + v) ^ Number('0b' + str2Array[i]))
          .toString(2).length) + (Number('0b' + v) ^ Number('0b' + str2Array[i])).toString(2);
      }
      return (Number('0b' + v) ^ Number('0b' + str2Array[i])).toString(2);
    }).join('');
  }


  cyclicMoveBinary(strArray: string[], moveNum: number, direction: string) {
    if (moveNum > strArray.join('').replace(/0b/g, '').length) {
      moveNum -= strArray.join('').replace(/0b/g, '').length * Math
        .floor(moveNum / strArray.join('').replace(/0b/g, '').length)
    }
    //??????right
    if (direction === "r") {
      let tempArray = strArray.join('').replace(/0b/g, '').split('');
      let right = tempArray.splice(tempArray.length - moveNum, tempArray.length);
      tempArray.unshift.apply(tempArray, right);
      let result: string[] = [];
      for (let i = 0; i < tempArray.length; i = i + 8) {
        result.push.apply(result, ['0b' + tempArray.slice(i, i + 8).join('')]);
      }
      return result;
    } else if (direction === "l") {
      let tempArray = strArray.join('').replace(/0b/g, '').split('');
      let left = tempArray.splice(0, moveNum);
      tempArray.push.apply(tempArray, left);
      let result: string[] = [];
      for (let i = 0; i < tempArray.length; i = i + 8) {
        result.push.apply(result, ['0b' + tempArray.slice(i, i + 8).join('')]);
      }
      return result;
    }

    return strArray;
  }

  //????????????????????????
  array2binaryString(buffer: Uint8Array | Array<string>) {
    return buffer.join(',').split(',').map((v) => {
      if (Number(v).toString(2).length < 8) {
        let add = '00000000';
        return add.slice(0, (8 - Number(v).toString(2).length)) + Number(v).toString(2);
      }
      return Number(v).toString(2);
    }).join('  ');
  }

  setStorage() {
    this.ngf.setItem<string>('secretKey', this.secretKey).then(v => { if (v) this.secretKey = v });
    this.ngf.setItem<string>('toBeProceessed', this.toBeProceessed).then(v => { if (v) this.toBeProceessed = v });
  }
  ngOnInit(): void {
    this.ngf.getItem<string>('secretKey').then(v => { if (v) this.secretKey = v });
    this.ngf.getItem<string>('toBeProceessed').then(v => { if (v) this.toBeProceessed = v });
  }

}
