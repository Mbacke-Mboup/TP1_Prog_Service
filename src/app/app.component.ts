import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { lastValueFrom } from 'rxjs';
import { Album } from './models/Album';
import { Chanson } from './models/Chanson';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  // ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  // Une variable devra être ajoutée ici
  // ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  resultArtist : boolean = false;
  resultSong : boolean = false;
  artist : string = "";
  albums: Album [] = [];
  chansons : Chanson[] = []

  // ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  // Le constructeur devra être ajouté ici
  // ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

  constructor(public http: HttpClient){

  }

  async searchArtist():Promise<void>{
    this.resultArtist = true;
    
    // ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
	  // La requête HTTP devra être ajoutée ici
    // ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

    let x = await lastValueFrom(this.http.get<any>("https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist="+this.artist+"&api_key=e34ebf8561ba7c653a21d1d99a1a0070&format=json"))
    for(let a of x.topalbums.album){
      this.albums.push(new Album(a.name, a.image[3]['#text'], a.artist.name));
    }
    console.log(this.albums)

  }

  newSearch():void{
    this.resultArtist = false;
    this.albums.splice(0, this.albums.length);
  }

  backAlbums():void{
    this.resultSong = false;
    this.resultArtist = true;
    this.chansons.splice(0, this.albums.length);
  }

  async infoAlbum(album:Album):Promise<void>{
    this.resultArtist = false;
    this.resultSong = true;
    let x = await lastValueFrom(this.http.get<any>("https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=e34ebf8561ba7c653a21d1d99a1a0070&artist="+album.artist+"&album="+album.name+"&format=json"))
    
    for(const a of x.album.tracks.track){
      this.chansons.push(new Chanson(a.name, a.url));
    }
    
  }
}
