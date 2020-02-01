var readlineSync = require('readline-sync');
const chalk = require('chalk');

class Card {                                                            //Start Deck 
    constructor(number, color) {
        this.number = number;
        this.color = color;

    }
    getValue(score = 0) {
        if (this.number === "King" || this.number === "Queen" || this.number === "Jack") {
            return 10;
        }
        else if (this.number === "Ace") {
            if (score + 11 > 21) {
                return 1;
            }
            else return 11;
        }
        else {
            return Number(this.number)
        }
    }
}

class Deck {
    constructor() {
        this.cards = this.generate()
        this.isCardTaken = new Array(this.cards.length).fill(false);

    }

    generate() {
        const array = [];
        const number = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "King", "Queen", "Jack"];
        const color = ["Clubs", "Diamonds", "Hearts", "Spades"];
        for (let i = 0; i < number.length; i++) {
            for (let j = 0; j < color.length; j++) {
                let card = new Card(number[i], color[j])
                array.push(card);
            }
        }
        return array;
    }
    randomCard() {
        while (true) {
            let randomNumber = Math.floor(Math.random() * 51);
            if (!this.isCardTaken[randomNumber]) {
                this.isCardTaken[randomNumber] = true;
                return this.cards[randomNumber]
            }
        }
    }
    display() {
        for (let i = 0; i < this.cards.length; i++) {
            console.log(this.cards[i].number + " " + this.cards[i].color)
        }
    }
}                                                                           // End Deck

const displayCard = (card) => {
    console.log(card.number + " " + card.color)
}

class Player {                                                              //Player
    constructor(deck) {
        this.hand = [];
        for (let i = 0; i < 2; i++) {
            this.hand.push(deck.randomCard())
        }
    }
    addPoint() {
        this.point = 0;
        for (let i = 0; i < this.hand.length; i++) {
            this.point += this.hand[i].getValue()
        }
        return this.point
    }
}                                                                           // End Player

function wait(ms) {
    var d = new Date();
    var d2 = null;
    do { d2 = new Date(); }
    while (d2 - d < ms);
}

let exit = false;

while (true) {                                              //firstWhile

    if (exit === true) {
        break
    }

    const deck = new Deck()
    let user = new Player(deck)
    let dealer = new Player(deck)
    let dealerAI = false;

    while (true) {                                          //secondWhile

        console.clear();

        if(dealerAI === true) {
            dealer.hand.forEach(displayCard)
            console.log(dealer.addPoint())
        }
        else {
            displayCard(dealer.hand[0])
            console.log("*********")
            console.log(dealer.hand[0].getValue())
        }
        console.log("------------------------------")
        user.hand.forEach(displayCard)
        console.log(user.addPoint())


        if (user.addPoint() > 21) {                             // Condition of losing
            console.log(" You lose! ");
            wait(3000)
            break
        }

        if (dealerAI === true) {                                // Start deaker Ai
            if (dealer.addPoint() > 21) {
                console.log(" You win !");
                wait(3000)
                break
            }
            else {
                if (dealer.addPoint() > user.addPoint()) {
                    console.log(" You lose! ");
                    wait(3000)
                    break
                }
                else {
                    if (dealer.addPoint() === user.addPoint()) {
                        console.log("TIE");
                        wait(3000)
                        break
                    }
                    else if (dealer.addPoint() !== user.addPoint()) {
                        console.log(" You win !")
                        wait(3000)
                        break
                    }

                }
            }
        }                                                                               // End deaker Ai
        
        choice = ['HIT', 'STAND', 'SURRENDER'],
            index = readlineSync.keyInSelect(choice, null, { cancel: 'EXIT' });

        if (choice[index] === "HIT") {
            user.hand.push(deck.randomCard())
            continue
        }
        else if (choice[index] === 'STAND') {
            for (i = dealer.addPoint(); i <= 16; i = dealer.addPoint()) {
                dealer.hand.push(deck.randomCard())
            }
            dealerAI = true;
        }
        else if (choice[index] === 'SURRENDER') {
            console.log(" YOU GAVE UP !")
            wait(3000)
            break
        }
        else if (choice[index] === undefined) {
            exit = true;
            break
        }
    }
}