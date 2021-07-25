import { Component, OnInit } from '@angular/core';
import { HttpService } from './core/services/http.service';

// import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public bingo: any = [];
  public newBingo: any = [];
  public allNumbers: any = [];
  public bingoOK: boolean = false;
  public cnt: number = 0;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.generationBINGO();
  }

  generatingAllNumbers() {
    this.cnt = 0;
    this.allNumbers = [];
    for (let i = 0; i < 75; i++) {
      this.allNumbers[i] = { number: i + 1, state: false };
    }
  }

  generationBINGO() {
    this.generatingAllNumbers();
    this.httpService.generatingBINGO().subscribe((resp: any) => {
      this.bingo = resp;

      for (let i = 0; i < 5; i++) {
        this.newBingo[i] = [];
        for (let x = 0; x < 5; x++) {
          if (i == 2 && x == 2) this.newBingo[i].push({});
          else {
            this.newBingo[i].push({
              number: this.bingo[x].numbers[i],
              state: false,
            });
          }
        }
      }
      console.log(this.newBingo);
    });
  }

  findNumber(): Promise<any> {
    return new Promise((resolve) => {
      let numberRand = Math.floor(Math.random() * (1 - 75)) + 75;
      let numberFind = this.allNumbers.find((v: any) => {
        return v.number === numberRand && v.state;
      });
      if (numberFind) {
        return resolve(this.findNumber());
      } else {
        return resolve(numberRand);
      }
    });
  }

  playBINGO() {
    this.findNumber().then((chosenNumber) => {
      let availableNumbers = this.allNumbers.filter((v: any, i: any) => {
        return v.state === false;
      });

      availableNumbers.map((v: any, i: any) => {
        if (v.number === chosenNumber) v.state = true;
      });

      this.newBingo.map((v: any, i: any) => {
        v.map((v1: any, i1: any) => {
          if (v1.number === chosenNumber) {
            v1.state = true;
            this.cnt++;
            if (this.cnt === 24) {
              setTimeout(() => {
                alert('¡BINGO!');
              }, 500);
            }
          }
        });
      });
    });
  }
}
