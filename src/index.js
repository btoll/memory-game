import {
    dom,
    element,
    util
} from 'pete-dom';

const reCard = /card\d{1,2}/;

const fade = function (elem, red, green, blue) {
  if (elem.fade) {
      clearTimeout(elem.fade);
  }

  elem.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

  if (red === 238 && green === 238 && blue === 221) {
      return;
  }

  const newred = red + Math.ceil((238 - red) / 10);
  const newgreen = green + Math.ceil((238 - green) / 10);
  const newblue = blue + Math.ceil((221 - blue) / 10);

  const repeat = () =>
      fade(elem, newred, newgreen, newblue);

  elem.fade = setTimeout(repeat, 50);
};

dom.ready(() => {
    // An array that holds the newly created card divs.
    const cards = [];

    // An array that holds the 2 selected cards.
    const selectedCards = [];

    // An array that holds the cards that have been successfully matched.
    const matched = [];
    const cardTable = element.get('cardTable');
    const totalCards = 24;
    const chances = 20;
    let timer = null;

    const resetCards = () => {
        const cardOne = dom.getDom(selectedCards[0][1]);
        const cardTwo = dom.getDom(selectedCards[1][1]);

        cardOne.style.backgroundColor = cardTwo.style.backgroundColor = '#60793e';
        cardOne.firstChild.style.display = cardTwo.firstChild.style.display = 'none';

        selectedCards.length = 0;

        // Re-attach the event handler.
        cardTable.on('click', showValue);
    };

    const compareCards = () => {
        const scorer = dom.getDom('scorer');

        // Remove the listener while comparing so the user doesn't get click-happy.
        cardTable.un('click', showValue);

        if (parseInt(selectedCards[0][0], 10) === parseInt(selectedCards[1][0], 10)) {
            const matches = dom.getDom('matches');

            // Increment the 'matches' score.
            matches.innerHTML = parseInt(matches.innerHTML, 10) + 1;
            matched.push(selectedCards[0][1], selectedCards[1][1]);
            //resetCards();

            // All the cards have been successfully matched.
            if (matched.length === 24) {
                if (confirm('Congratulations, you won! Play again?')) {
                    clearTimeout(timer);
                    initGame();
                }
            } else {
                fade(scorer, 0, 0, 221);
                scorer.innerHTML = 'Match!';
                selectedCards.length = 0;

                // Re-attach the event handler.
                cardTable.on('click', showValue);
            }

        } else {
            const chances = dom.getDom('chances');

            fade(scorer, 238, 0, 0);
            scorer.innerHTML = 'Too bad, you lost a chance!';

            // There was no match so reset their backgrounds images after 1.2 seconds.
            timer = setTimeout(resetCards, 1200);

            if ((chances.innerHTML = parseInt(chances.innerHTML, 10) - 1) === 0) {
                if (confirm('You lost! Play again?')) {
                    clearTimeout(timer);
                    initGame();
                } else {
                    dom.getDom('cardTable').style.display = 'none';
                }
            }
        }
    };

    const showValue = e => {
        const target = e.target;

        // Since there's only one handler for the entire page we need to make sure the user actually clicked on a card and discard all other events.
        if (reCard.test(target.id)) {
            target.firstChild.style.display = 'block';
            // TODO: getFirst/getLast method on composite object?
            selectedCards.push([element.gets('span', target).elements[0].textContent, target.id]);

            if (selectedCards.length === 2) {
                // Send along the text from within the paragraph (it will be a number) and the div id as an array.
                compareCards();
            }
        }
    };

    const initGame =  () => {
        const seed = (() => {
            let arr = [];

            // Make a duplicated 12 element array, non-inclusive.
            return (
                arr = util.range(`0...${totalCards/2}`)
            ).concat(arr);
        })();

        seed.sort(() => (Math.round(Math.random()) - 0.5));

        cards.length = 0;

        dom.getDom('cardTable').innerHTML = '';
        dom.getDom('chances').innerHTML = chances;
        dom.getDom('matches').innerHTML = 0;

        // Each div MUST have a unique id, that's how this works :)
        for (let i = totalCards; i--;) {
            cards.push(dom.create({
                tag: 'div',
                attr: {
                    id: 'card' + i
                },
                items: [{
                    tag: 'p',
                    items: [{
                        tag: 'span',
                        attr: {
                            innerHTML: seed[i]
                        }
                    }]
                }]
            }));
        }

        const frag = document.createDocumentFragment();

        for (let i = cards.length; i--;) {
            frag.appendChild(cards[i].dom);
        }

        dom.getDom('cardTable').appendChild(frag);

        // Event delegation.
        cardTable.on('click', showValue);

        selectedCards.length = 0;
        matched.length = 0;
    };

    initGame();
});

