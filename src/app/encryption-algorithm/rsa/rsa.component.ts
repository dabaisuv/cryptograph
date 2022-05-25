import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rsa',
  templateUrl: './rsa.component.html',
  styleUrls: ['./rsa.component.sass']
})
export class RsaComponent implements OnInit {

  secretKey: string = "";
  toBeProceessed: string = "";
  publicKey: string = "";
  generate() {
    const p = crypto.getRandomValues()
  }
  clear() {
    document.querySelector("div>p")!.textContent = '';
    
  }

  display(text: string) {
    console.log(text);
    let textShow = document.querySelector("div>p");
    if (textShow) {
      textShow.textContent += text + "\n"
    }

  }
  constructor() { }

  ngOnInit(): void {
  }

}
