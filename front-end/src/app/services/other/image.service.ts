import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MediaService {
    formatMediaUrl(image: string | undefined): string {
        if (typeof image === 'string') {
            return image;
        }
        return '';
    }
}