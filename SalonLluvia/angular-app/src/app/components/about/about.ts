import { AfterViewInit, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'about',
    imports: [NgOptimizedImage],
    templateUrl: './about.html',
    styleUrl: './about.css',
})
export class About implements AfterViewInit {
    async ngAfterViewInit(): Promise<void> {
        await this.startIncrementingYoe();
    }

    // https://github.com/inorganik/countUp.js#including-countup
    private async startIncrementingYoe() {
        const { CountUp: CountUp } = await import('countup.js');

        // Facts counter
        const counterOptions = {
            autoAnimate: true,
            onCompleteCallback: this.appendPlusSignToCounter,
        };

        const yoe: number = 15;
        const countUp = new CountUp('counter-yoe', yoe, counterOptions);
        countUp.start();
    }

    private appendPlusSignToCounter() {
        const counterElement = document.querySelector('#counter-yoe');

        if (counterElement && !counterElement.textContent.includes('+')) {
            counterElement.textContent += '+';
        }
    }
}
