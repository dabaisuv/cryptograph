import { Component, OnInit } from '@angular/core';
import * as localForage from 'localforage';
import { bufferToggle } from 'rxjs';

@Component({
  selector: 'app-rsa',
  templateUrl: './rsa.component.html',
  styleUrls: ['./rsa.component.sass']
})
export class RsaComponent implements OnInit {
  ngf: LocalForage = localForage.createInstance({ name: 'encryption-algorithm', storeName: 'rsa' });

  secretKey: string = "";
  toBeProceessed: string = "";
  publicKey: string = "";

  generate() {
    console.time('generate');
    const start = new Date();
    this.waiting(true);
    this.clear();
    const p = this.getPrime();
    const q = this.getPrime();
    const n = p * q;
    const Euler_n = (p - 1n) * (q - 1n);
    const EandD = this.getEAndD(Euler_n);
    this.publicKey = this.strToBase64(EandD.E.toString(16) + "+++" + n.toString(16));
    this.secretKey = this.strToBase64(EandD.D.toString(16) + "+++" + n.toString(16));
    console.log(`p = ${p}`);
    console.log(`q = ${q}`);
    console.log(`n = ${n}`);
    console.log(`Euler_n = ${Euler_n}`);
    console.log(`E = ${EandD.E}`);
    console.log(`D = ${EandD.D}`);
    console.log(`PublicKey: ${this.publicKey}`);
    console.log(`SecretKey: ${this.secretKey}`);
    this.waiting(false);
    const end = new Date();
    this.display(`Generate Successfully! (${(end.getTime() - start.getTime()) / 1000} s)`)
    console.timeEnd('generate');
    this.setStorage();
  }

  encrypt() {
    if (this.secretKey === '') {
      alert("Not PublibKey")
    }
    const encryptedText = this.toBeProceessed;
    this.clear()
    let cryptedArray: bigint[] = [];
    const EAndN = this.base64Tobig(this.publicKey);
    const textArray = new TextEncoder().encode(encryptedText);
    console.log(EAndN.big1, EAndN.big2);
    let tempText = '';
    textArray.map(v => {
      tempText += '0x' + this.power(BigInt(v), EAndN.big1, EAndN.big2).toString(16) + ',';
      return v;
    });
    this.toBeProceessed = btoa(tempText.slice(0, -1));
  }

  decrypt() {
    const encryptedText = this.base64ToStr(this.toBeProceessed);
    const tempArray = encryptedText.split(',');
    const DAndN = this.base64Tobig(this.secretKey);
    let resultArray: number[] = [];
    tempArray.map((v) => {
      resultArray.push(Number(this.power(BigInt(v), DAndN.big1, DAndN.big2)));
      return v;
    });
    const resultUint8Array = new Uint8Array(resultArray);
    this.toBeProceessed = new TextDecoder().decode(resultUint8Array)

  }
  setStorage() {
    this.ngf.setItem('toBeProceessed', this.toBeProceessed).then();
    this.ngf.setItem('secretKey', this.secretKey).then();
    this.ngf.setItem('publicKey', this.publicKey).then();
    this.ngf.setItem('display', document.querySelector('div>p')?.textContent).then();
  }

  base64Tobig(str: string) {
    const buffer = atob(str);
    //fixed a bug!!!
    if (buffer.split('+++')[0][0] === '-') {
      return {
        big1: BigInt('-0x' + buffer.split("+++")[0].slice(1)),
        big2: BigInt('0x' + buffer.split("+++")[1])
      }

    }
    return {
      big1: BigInt('0x' + buffer.split("+++")[0]),
      big2: BigInt('0x' + buffer.split("+++")[1])
    }
  }

  strToBase64(str: string) {
    // let numArray = [];
    // let hexStringArray = str.split('');
    // if (hexStringArray.length % 2 !== 0) {
    //   numArray.push(Number('0x' + hexStringArray.shift()));
    //   for (let index = 0; index < hexStringArray.length; index = index + 2) {
    //     numArray.push(Number('0x' + hexStringArray.splice(0, 2).join('')));
    //   }
    // } else {
    //   for (let index = 0; index < hexStringArray.length; index = index + 2) {
    //     numArray.push(Number('0x' + hexStringArray.splice(0, 2).join('')));
    //   }
    // }
    // let tempStr = '';
    // numArray.map(v => {
    //   tempStr += String.fromCharCode(v);
    // })

    // return btoa(tempStr);
    return btoa(str);

  }
  base64ToStr(base64: string) {
    return atob(base64);
  }

  bigToBase64(num: bigint) {
    let numArray = [];
    let hexStringArray = num.toString(16).split('');
    if (hexStringArray.length % 2 !== 0) {
      numArray.push(Number('0x' + hexStringArray.shift()));
      for (let index = 0; index < hexStringArray.length; index = index + 2) {
        numArray.push(Number('0x' + hexStringArray.splice(0, 2).join('')));
      }
    } else {
      for (let index = 0; index < hexStringArray.length; index = index + 2) {
        numArray.push(Number('0x' + hexStringArray.splice(0, 2).join('')));
      }
    }
    let tempStr = '';
    numArray.map(v => {
      tempStr += String.fromCharCode(v);
    })

    return btoa(tempStr);
  }

  waiting(status: Boolean) {
    if (status) {
      document.body.style.cursor = 'wait';
    } else {
      document.body.style.cursor = '';
    }

  }

  getEAndD(euler_n: bigint) {
    while (true) {
      const random = this.get2048Random() % euler_n;
      const result = this.exd_eculid(euler_n, random);
      if (result.gcd === 1n && result.inverse !== null) {
        return {
          E: random,
          D: result.inverse
        };
      }
    }
  }

  exd_eculid(a: bigint, b: bigint) {
    let X1 = 1n
      , X2 = 0n
      , X3 = a;

    let Y1 = 0n
      , Y2 = 1n
      , Y3 = b;

    while (true) {
      if (Y3 === 0n) {
        return {
          gcd: X3,
          inverse: null
        }
      }
      if (Y3 === 1n) {
        return {
          gcd: Y3,
          inverse: Y2
        }
      }
      let Q = X3 / Y3;
      let T1 = X1 - Q * Y1
        , T2 = X2 - Q * Y2
        , T3 = X3 - Q * Y3;
      X1 = Y1;
      X2 = Y2;
      X3 = Y3;
      Y1 = T1;
      Y2 = T2;
      Y3 = T3;
    }
  }


  getPrime() {
    while (true) {
      const random = this.get640Random();
      if (this.isPrime(random)) {
        return random;
      }
    }

  }

  power(x: bigint, y: bigint, p: bigint) {

    // Initialize result 
    // (JML- all literal integers converted to use n suffix denoting BigInt)
    let res = 1n;

    // Update x if it is more than or
    // equal to p
    x = x % p;
    while (y > 0n) {

      // If y is odd, multiply
      // x with result
      if (y & 1n)
        res = (res * x) % p;

      // y must be even now
      y = y / 2n; // (JML- original code used a shift operator, but division is clearer)
      x = (x * x) % p;
    }
    return res;
  }


  // This function is called
  // for all k trials. It returns
  // false if n is composite and
  // returns false if n is
  // probably prime. d is an odd
  // number such that d*2<sup>r</sup> = n-1
  // for some r >= 1
  miillerTest(d: bigint, n: bigint) {
    // (JML- all literal integers converted to use n suffix denoting BigInt)

    // Pick a random number in [2..n-2]
    // Corner cases make sure that n > 4
    /* 
        JML- I can't mix the Number returned by Math.random with
        operations involving BigInt. The workaround is to create a random integer 
        with precision 6 and convert it to a BigInt.
    */
    const r = BigInt(Math.floor(Math.random() * 100_000))
    // JML- now I have to divide by the multiplier used above (BigInt version)
    const y = r * (n - 2n) / 100_000n
    let a = 2n + y % (n - 4n);

    // Compute a^d % n
    let x = this.power(a, d, n);

    if (x == 1n || x == n - 1n)
      return true;

    // Keep squaring x while one
    // of the following doesn't
    // happen
    // (i) d does not reach n-1
    // (ii) (x^2) % n is not 1
    // (iii) (x^2) % n is not n-1
    while (d != n - 1n) {
      x = (x * x) % n;
      d *= 2n;

      if (x == 1n)
        return false;
      if (x == n - 1n)
        return true;
    }

    // Return composite
    return false;
  }

  // It returns false if n is
  // composite and returns true if n
  // is probably prime. k is an
  // input parameter that determines
  // accuracy level. Higher value of
  // k indicates more accuracy.
  isPrime(n: bigint, k = 40) {
    // (JML- all literal integers converted to use n suffix denoting BigInt)
    // Corner cases
    if (n <= 1n || n == 4n) return false;
    if (n <= 3n) return true;

    // Find r such that n =
    // 2^d * r + 1 for some r >= 1
    let d = n - 1n;
    while (d % 2n == 0n)
      d /= 2n;

    // Iterate given nber of 'k' times
    for (let i = 0; i < k; i++)
      if (!this.miillerTest(d, n))
        return false;

    return true;
  }

  get2048Random() {
    const random2048 = crypto.getRandomValues(new BigUint64Array(32));
    let tempString = '0x';
    random2048.map(v => {
      tempString += v.toString(16).padStart(8, '0');
      return v;
    });
    return BigInt(tempString);
  }

  get640Random() {
    const random640 = crypto.getRandomValues(new BigUint64Array(10));
    let tempString = '0x';
    random640.map(v => {
      tempString += v.toString(16).padStart(8, '0');
      return v;
    });
    return BigInt(tempString);
  }
  clear() {
    document.querySelector("div>p")!.textContent = '';
    this.toBeProceessed = '';
  }

  display(text: string) {
    console.log(text);
    let textShow = document.querySelector("div>p");
    if (textShow) {
      textShow.textContent += text + "\n"
    }

  }

  constructor() { }

  ngOnInit() {
    this.ngf.getItem<string>("toBeProceessed").then(v => { if (v) this.toBeProceessed = v; });
    this.ngf.getItem<string>("secretKey").then(v => { if (v) this.secretKey = v });
    this.ngf.getItem<string>('publicKey').then(v => { if (v) this.publicKey = v });
    this.ngf.getItem<string>('display').then(v => { if (v) document.querySelector('div>p')!.textContent = v });

  }

}
