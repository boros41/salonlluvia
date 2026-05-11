import { Component, ChangeDetectionStrategy, AfterViewInit, signal, WritableSignal, Injectable, inject, DestroyRef, OnInit, effect, afterNextRender, computed, Signal } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatChipsModule } from '@angular/material/chips';
import { TitleCasePipe } from "@angular/common";

import Masonry from "masonry-layout";
import { Lightbox } from "lightbox3";
import Images from "../../dto/gallery/images";
import Image from "../../dto/gallery/image";
import imagesLoaded from 'imagesloaded';
import NotificationService from "../../services/notification/notification-service";
import ImageFilters from "../../dto/gallery/image-filters";
import Hairstyle from "../../dto/gallery/hairstyle";
import HairColor from "../../dto/gallery/hair-color";
import { CdkAutofill } from "@angular/cdk/text-field";

@Component({
    selector: "gallery",
    imports: [MatButtonModule, MatCardModule, MatChipsModule, MatProgressSpinnerModule, TitleCasePipe],
    templateUrl: "./gallery.html",
    styleUrl: "./gallery.css",
})
@Injectable({ providedIn: "root" })
export class Gallery implements OnInit, AfterViewInit {
    http = inject(HttpClient);
    destroyRef = inject(DestroyRef);
    private _snackBar = inject(MatSnackBar);
    images: WritableSignal<Array<Image>> = signal([]);
    filteredImages: WritableSignal<Array<HTMLElement>> = signal([]);
    private _imageFilters: WritableSignal<ImageFilters> = signal({ hairstyles: new Array<Hairstyle>(), hairColors: new Array<HairColor>() });
    imageFilters: Signal<ImageFilters> = computed(() => this._imageFilters());
    isFilterBoth = signal(true);
    isFilterFemale = signal(false);
    isFilterMale = signal(false);
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

                    if (!(node instanceof HTMLElement)) {
                        return;
                    }

                    this.filteredImages().push(node);

                    // this is a new node added to the DOM so add it to masonry.js
                    this.masonry?.addItems?.(node as any);

                    // at this point, the masonry item is added & in the DOM but its image may not be loaded
                    // we'll have to recalculate the the masonry layout once the images loaded
                    // https://masonry.desandro.com/layout#imagesloaded
                    imagesLoaded(node, () => {
                        this.masonry?.layout?.();
                    });
                });

                mutation.removedNodes.forEach((node) => {
                    console.log("Removed:", node);

                    if (!(node instanceof HTMLElement)) {
                        return;
                    }

                    // Angular automatically removed this node from the template's "for track" which triggered this observer
                    // Reload masonry's items to apply changes from this DOM node deletion
                    // https://masonry.desandro.com/methods#reloaditems:~:text=Utilities-,reloadItems,-Recollects%20all%20item
                    this.masonry?.reloadItems?.();
                    this.masonry?.layout?.();

                    this.filteredImages.set(this.filteredImages().filter(element => element !== node));
                });
            }
        }
    });

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        this.initializeLightbox3();

        this.initializeMasonry();

        // gallery.html is reading the images signal to add our image elements to the DOM
        // so we need to observe these DOM changes to properly recalculate masonry's layout
        this._observer.observe(document.getElementById("grid")!, {
            childList: true,
        });

        // TODO: cache images signal instead of calling backend each time
        this.fetchImages();
        this.fetchImageFilters();
    }

    private fetchImages(queryParams?: URLSearchParams): void {
        const url = `https://api.salonlluvia.com/azureblobstorage/image-url?${queryParams?.toString()}`;

        this.http.get<Images>(url, { observe: "response" })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: HttpResponse<Images>) => {
                    if (response.status === 204 || response.body === null) {
                        console.log("No images to display!");
                        let noImagesMessage = "Lo sentimos, por el momento no hay imágenes disponibles ";
                        
                        if (queryParams) {
                            noImagesMessage += queryParams.size > 1 ? "con esos filtros." : "con ese filtro.";
                        }
                        const dismissAction = "Descartar";
                        this._snackBar.open(noImagesMessage, dismissAction);

                        return;
                    }
                    
                    // will trigger the template's loop to add or remove images which will trigger _observer above
                    // Angular will automatically remove the element nodes via the template's "for track" if the response contains less images than the signal
                    // https://angular.dev/guide/templates/control-flow#why-is-track-in-for-blocks-important
                    this.images.set(response.body.images);

                    return;
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

    // populates the filter checkboxes
    private fetchImageFilters(): void {
        const url = "https://api.salonlluvia.com/azureblobstorage/filters";

        this.http.get<ImageFilters>(url, { observe: "response" })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: HttpResponse<ImageFilters>) => {
                    console.log(`HTTP response from fetchImageFilters(): ${response}`);

                    if (response.body) {
                        this._imageFilters.set(response.body);
                    }
                },
                error: (error: HttpErrorResponse) => {
                    console.log(`HTTP error from fetchImageFilters(): ${error}`);
                },
                complete: () => {

                }
            });
    }

    filterImagesByGender(gender: string): void {
        switch (gender) {
            case "Ambos":
                this.isFilterBoth.set(true);
                this.isFilterFemale.set(false);
                this.isFilterMale.set(false);
                break;
            case "Mujer":
                this.isFilterFemale.set(true);
                this.isFilterBoth.set(false);
                this.isFilterMale.set(false);
                break;
            case "Hombre":
                this.isFilterMale.set(true);
                this.isFilterBoth.set(false);
                this.isFilterFemale.set(false);
                break;
        }

        // const hairstyleFilters = Array.from(document.querySelectorAll(".filter-hairstyle-true"));
        // const hairColors = Array.from(document.querySelectorAll(".filter-hair-color-true"));

        // this.fetchFilteredImages(hairstyleFilters, hairColors);
    }

    filterImagesByHairstyle(event: Event) {
        const element = event.currentTarget as HTMLElement;

        if (element.classList.contains("text-bg-primary")) {
            element.classList.remove("text-bg-primary");
            element.classList.remove("filter-hairstyle-true");
        } else {
            element.classList.add("text-bg-primary");
            element.classList.add("filter-hairstyle-true");
        }

        // const hairstyleFilters = Array.from(document.querySelectorAll(".filter-hairstyle-true"));
        // const hairColors = Array.from(document.querySelectorAll(".filter-hair-color-true"));

        // this.fetchFilteredImages(hairstyleFilters, hairColors);
    }

    filterImagesByHairColor(event: Event) {
        const element = event.currentTarget as HTMLElement;

        if (element.classList.contains("text-bg-primary")) {
            element.classList.remove("text-bg-primary");
            element.classList.remove("filter-hair-color-true");
        } else {
            element.classList.add("text-bg-primary");
            element.classList.add("filter-hair-color-true");
        }

        // const hairstyleFilters = Array.from(document.querySelectorAll(".filter-hairstyle-true"));
        // const hairColors = Array.from(document.querySelectorAll(".filter-hair-color-true"));

        // this.fetchFilteredImages(hairstyleFilters, hairColors);
    }

    fetchFilteredImages(/*hairstyleFilters: Array<Element>, hairColorFilters: Array<Element>*/) {
        const queryParams = new URLSearchParams();
        const gender: string = this.isFilterFemale() ? "F" : this.isFilterMale() ? "M" : "both";
        const hairstyleFilters = Array.from(document.querySelectorAll(".filter-hairstyle-true"));
        const hairColorFilters = Array.from(document.querySelectorAll(".filter-hair-color-true"));

        queryParams.append("gender", gender);

        hairstyleFilters.forEach((element) => {
            const queryValue = element.textContent?.trim().toLowerCase();

            if (queryValue) {
                queryParams.append("hairstyles", queryValue);
            }
        });

        hairColorFilters.forEach((element) => {
            const queryValue = element.textContent?.trim().toLowerCase();

            if (queryValue) {
                queryParams.append("hairColors", queryValue);
            }
        });

        this.fetchImages(queryParams);
    }

    private initializeMasonry(): void {
        // https://masonry.desandro.com/#:~:text=%3A%20200%0A%7D)%3B-,Initialize%20with%20Vanilla%20JavaScript,-You%20can%20use

        const options = {
            itemSelector: ".grid-item",
            columnWidth: ".grid-sizer",
            percentPosition: true,
            transitionDuration: "0"
        };

        this.masonry = new Masonry("#grid", options);
    }

    private initializeLightbox3(): void {
        // https://lokeshdhakar.com/projects/lightbox3/#api-init:~:text=%3C/script%3E-,npm,-Install%20the%20package

        const lightbox = Lightbox.init();
    }
}

