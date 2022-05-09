import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-playfair',
  templateUrl: './playfair.component.html',
  styleUrls: ['./playfair.component.sass']
})
export class PlayfairComponent implements OnInit {
  secretKey: string = "";
  encryptionMotrix: string[][] = [];
  toBeProceessed: string = "";
  constructor() { }

  clear() {
    document.querySelector("div>p")!.textContent = ''
  }

  display(text: string) {
    console.log(text);
    let textShow = document.querySelector("div>p");
    if (textShow) {
      textShow.textContent += text + "\n"
    }

  }

  genMatrix() {
    if (this.secretKey === "") {
      alert("Please input secretKey!");
      return;
    }
    this.clear();
    this.encryptionMotrix = [];
    //设置字母表数组（去掉了'J'字母）
    let alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ".split('');
    this.display(`字母表(去掉了'J'字母)：${alphabet.join('')}`);
    //将输入的密码转为大写并去重
    let uniqueArray = [...new Set(this.secretKey.toUpperCase())];
    //this.display(`输入的密码: ${this.secretKey} 处理后的密码: ${uniqueArray.join('')}`)
    //去除字母表中与uniqueArray重复的字符并拼接
    let encryptionArray = uniqueArray
      .concat(alphabet.filter((value) => {
        return uniqueArray.indexOf(value) < 0;
      }))
    //将上面的encryptionArray转为二维数组 5*5（加密矩阵）
    encryptionArray.map((value, index) => {
      let line = Math.floor(index / 5);
      if (!this.encryptionMotrix[line]) {
        this.encryptionMotrix[line] = [];
      }
      this.encryptionMotrix[line].push(value);
    })
    this.display(`加密矩阵:`);
    for (let i = 0; i < this.encryptionMotrix.length; i++) {
      this.display(`${this.encryptionMotrix[i].join(' ')}`);
    }

  }

  encrypt() {
    let toBeEncrypt = this.toBeProceessed;
    //将 待加密字符串 转为大写并转为字符数组,并将两两相连
    //的重复字母以'X'插入分割,如果处理后为奇数则在末尾再插入'X'
    let toBeEncryptArray = toBeEncrypt.toUpperCase().split('');
    for (let i = 0; i < toBeEncryptArray.length - 1; i++) {
      if (toBeEncryptArray[i] === toBeEncryptArray[i + 1]) {
        toBeEncryptArray.splice(i + 1, 0, 'X');
        i++;
      }
    }
    if ((toBeEncryptArray.length & 1) === 1) {
      toBeEncryptArray.push('X')
    }


    // 加密
    // 将处理后的明文以两两一对的字母对形式分开。
    // 对于字母对<x,y>在密码表中的位置：
    // 1.x与y在同一行，我们用x与y在密码表中右侧的字母替代。
    // 2.x与y在同一列，我们用x与y在密码表中下方的字母替代。
    // 3.x与y既不在同一列也不在同一行，我们以其为对角线构造一个矩形,
    // 然后选择此矩形上另两个顶点对应的字母替代。至于替代顺序需要事先约定，我们这里规定同行替代。
    let encrypted: string[] = [];
    toBeEncryptArray.map((value) => {
      let result: {
        row: number,
        colunm: number
      } = {
        row: -1,
        colunm: -1
      };

      this.encryptionMotrix.map((v, i) => {
        if (v.indexOf(value) > -1) {
          result.row = i;
          result.colunm = v.indexOf(value);
        }

      });

      return result;
    }).map((value, index, array) => {
      if ((index & 1) === 0) {
        //第一种情况：两个字母在同一行
        if (value.row === array[index + 1].row) {
          if (array[index + 1].colunm === 4) {
            encrypted.push(this.encryptionMotrix[value.row][value.colunm + 1]);
            encrypted.push(this.encryptionMotrix[value.row][0]);
          } else if (value.colunm === 4) {
            encrypted.push(this.encryptionMotrix[value.row][0]);
            encrypted.push(this.encryptionMotrix[value.row][array[index + 1].colunm + 1]);
          } else {
            encrypted.push(this.encryptionMotrix[value.row][value.colunm + 1]);
            encrypted.push(this.encryptionMotrix[value.row][array[index + 1].colunm + 1]);
          }
          //第二种情况：两个字母在同一列
        } else if (value.colunm === array[index + 1].colunm) {
          if ((array[index + 1].row === value.row) && value.row === 4) {
            encrypted.push(this.encryptionMotrix[0][value.colunm]);
            encrypted.push(this.encryptionMotrix[0][array[index + 1].colunm]);
          } else if (array[index + 1].row === 4) {
            encrypted.push(this.encryptionMotrix[value.row + 1][value.colunm]);
            encrypted.push(this.encryptionMotrix[0][array[index + 1].colunm]);
          } else if (value.row === 4) {
            encrypted.push(this.encryptionMotrix[0][value.colunm]);
            encrypted.push(this.encryptionMotrix[array[index + 1].row + 1][array[index + 1].colunm]);
          } else {
            encrypted.push(this.encryptionMotrix[value.row + 1][value.colunm]);
            encrypted.push(this.encryptionMotrix[array[index + 1].row + 1][array[index + 1].colunm]);
          }
          //第三种情况:两个字母既不在同一列也不在同一行
        } else {
          encrypted.push(this.encryptionMotrix[value.row][array[index + 1].colunm]);
          encrypted.push(this.encryptionMotrix[array[index + 1].row][value.colunm]);
        }
      }
    });
    this.display(`明文: ${toBeEncrypt}  ->  加密为: ${encrypted.join('')}`);
    this.toBeProceessed = encrypted.join('');
    return encrypted;
  }

  decrypt() {
    let encrypted = this.toBeProceessed;
    //将待解密的字符串转为字符数组
    let toBeDecryptArray = encrypted.split('');
    //解密，与加密相反
    let decrypted: string[] = [];
    toBeDecryptArray.map((value) => {
      let result: {
        row: number,
        colunm: number
      } = {
        row: -1,
        colunm: -1
      };

      this.encryptionMotrix.map((v, i) => {
        if (v.indexOf(value) > -1) {
          result.row = i;
          result.colunm = v.indexOf(value);
        }

      });
      return result;
    }).map((value, index, array) => {
      if ((index & 1) === 0) {
        //第一种情况：两个字母在同一行
        if (value.row === array[index + 1].row) {
          if (array[index + 1].colunm === 0) {
            decrypted.push(this.encryptionMotrix[value.row][value.colunm - 1]);
            decrypted.push(this.encryptionMotrix[value.row][4]);
          } else if (value.colunm === 0) {
            decrypted.push(this.encryptionMotrix[value.row][4]);
            decrypted.push(this.encryptionMotrix[value.row][array[index + 1].colunm - 1]);
          } else {
            decrypted.push(this.encryptionMotrix[value.row][value.colunm - 1]);
            decrypted.push(this.encryptionMotrix[value.row][array[index + 1].colunm - 1]);
          }
          //第二种情况：两个字母在同一列
        } else if (value.colunm === array[index + 1].colunm) {
          if ((array[index + 1].row === value.row) && value.row === 0) {
            decrypted.push(this.encryptionMotrix[4][value.colunm]);
            decrypted.push(this.encryptionMotrix[4][array[index + 1].colunm]);
          } else if (array[index + 1].row === 0) {
            decrypted.push(this.encryptionMotrix[value.row - 1][value.colunm]);
            decrypted.push(this.encryptionMotrix[4][array[index + 1].colunm]);
          } else if (value.row === 0) {
            decrypted.push(this.encryptionMotrix[4][value.colunm]);
            decrypted.push(this.encryptionMotrix[array[index + 1].row - 1][array[index + 1].colunm]);
          } else {
            decrypted.push(this.encryptionMotrix[value.row - 1][value.colunm]);
            decrypted.push(this.encryptionMotrix[array[index + 1].row - 1][array[index + 1].colunm]);
          }
          //第三种情况:两个字母既不在同一列也不在同一行
        } else {
          decrypted.push(this.encryptionMotrix[value.row][array[index + 1].colunm]);
          decrypted.push(this.encryptionMotrix[array[index + 1].row][value.colunm]);
        }
      }
    });

    for (let i = 0; i < decrypted.length; i = i + 2) {

      if ((decrypted[i] === decrypted[i + 1]) && decrypted[i] === 'X') {
        decrypted.splice(i, 1);
        i--;
      } else if (decrypted[i] === 'X') {
        decrypted.splice(i, 1);
        i--;
      } else if (decrypted[i + 1] === 'X') {
        decrypted.splice(i + 1, 1);
        i--;
      }

    }
    this.display(`密文: ${encrypted}  ->  解密为: ${decrypted.join('')}`)
    this.toBeProceessed = decrypted.join('');
    return decrypted;

  }

  ngOnInit(): void {
  }

}
