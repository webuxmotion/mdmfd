import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Desk, Message } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DesksService {

    constructor(
        private http: HttpClient
    ) {}

    fetch(): Observable<Desk[]> {
        return this.http.get<Desk[]>('/api/desk')
    }

    getById(id: string): Observable<Desk> {
        return this.http.get<Desk>(`/api/desk/${id}`)
    }

    create(desk: Desk): Observable<Desk> {
        const fd = new FormData()

        fd.append('name', name)
        console.log(fd)

        return this.http.post<Desk>('/api/desk', desk)
    }

    update(id: string, name: string): Observable<Desk> {
        const fd = new FormData()

        fd.append('name', name)

        return this.http.patch<Desk>(`/api/desk/${id}`, fd)
    }

    delete(id: string): Observable<Message> {
        return this.http.delete<Message>(`/api/desk/${id}`)
    }

}