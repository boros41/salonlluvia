import { Component, ChangeDetectionStrategy, AfterViewInit, signal, WritableSignal, Injectable, inject, DestroyRef, OnInit, effect, afterNextRender } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatSnackBar } from "@angular/material/snack-bar";
import {MatChipsModule} from '@angular/material/chips';

import Masonry from "masonry-layout";
import { Lightbox } from "lightbox3";
import ImagesResponse from "../../dto/gallery/images";
import Image from "../../dto/gallery/image";
import imagesLoaded from 'imagesloaded';
import NotificationService from "../../services/notification/notification-service";

@Component({
    selector: "gallery",
    imports: [MatButtonModule, MatCardModule, MatChipsModule, MatProgressSpinnerModule],
    templateUrl: "./gallery.html",
    styleUrl: "./gallery.css",
})
@Injectable({ providedIn: "root" })
export class Gallery implements OnInit, AfterViewInit {
    http = inject(HttpClient);
    destroyRef = inject(DestroyRef);
    private _snackBar = inject(MatSnackBar);
    images: WritableSignal<Array<Image>> = signal([]);
    masonry?: Masonry;
    private masonryIntervalId = -1;
    private readonly _notificationService = inject(NotificationService);

    private readonly _observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                console.log("Gallery #grid children changed");
                console.log("Children added: " + mutation.addedNodes.length);
                mutation.addedNodes.forEach((node) => {
                    console.log("#grid child added:", node);
                    console.log(`#grid child added is Element?: ${node instanceof Element}`)
                    if (node instanceof Element) {
                        //this.masonry?.appended?.(node as any);
                        this.masonry?.addItems?.(node as any);

                        // at this point, the masonry item is added & in the DOM but its image may not be loaded
                        // we'll have to recalculate the the masonry layout once the images loaded
                        // https://masonry.desandro.com/layout#imagesloaded
                        imagesLoaded(node, () => {
                            this.masonry?.layout?.();
                        });
                    }
                });

                // mutation.removedNodes.forEach((node) => {
                //     console.log("Removed:", node);
                // });
            }
        }
    });

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        this.initializeLightbox3();

        // TODO: cache images signal instead of calling backend each time
        this.fetchImages();
    }

    private fetchImages(): void {
        const url = "https://localhost:7172/api/azureblobstorage/image-url";

        this.http.get<ImagesResponse>(url, { observe: "response" })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: HttpResponse<ImagesResponse>) => {
                    if (response.status === 204 || response.body === null) {
                        console.log("No images to display!");
                        const noImagesMessage = "Lo sentimos, por el momento no hay imágenes disponibles.";
                        const dismissAction = "Descartar";
                        this._snackBar.open(noImagesMessage, dismissAction);

                        return;
                    }

                    this.initializeMasonry();

                    // gallery.html is reading the images signal to add our image elements to the DOM
                    // so we need to observe these DOM changes to properly recalculate masonry's layout
                    this._observer.observe(document.getElementById("grid")!, {
                        childList: true,
                    });

                    this.images.set(response.body.images);
                },
                error: (error: HttpErrorResponse) => {
                    console.log(error);

                    switch (error.status) {
                        case 0: 
                            this._notificationService.alert("No se pueden obtener las imágenes en este momento. ¡Lo sentimos!");
                            break;
                    }
                },
                complete: () => {

                }
            });
    }

    private initializeMasonry(): void {
        // https://masonry.desandro.com/#:~:text=%3A%20200%0A%7D)%3B-,Initialize%20with%20Vanilla%20JavaScript,-You%20can%20use

        const options = {
            itemSelector: ".grid-item",
            columnWidth: ".grid-sizer",
            percentPosition: true,
            transitionDuration: "0.8s"
        };

        this.masonry = new Masonry("#grid", options);
    }

    private initializeLightbox3(): void {
        // https://lokeshdhakar.com/projects/lightbox3/#api-init:~:text=%3C/script%3E-,npm,-Install%20the%20package

        const lightbox = Lightbox.init();
    }
}

