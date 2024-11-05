import { Injectable } from "@angular/core";
import { Client } from "../../models/Client";
import { Company } from "../../models/Company";
import Parse from "parse";
import { AuthService } from "../other/auth.service";

@Injectable({
    providedIn: "root",
  })
  export class ClientService {
    constructor(private authService: AuthService) {}

    async getClients(data: any): Promise<Client[]> {
        // return await fetch('http://localhost:1337/parse/functions/getClients',{
        //     method: 'POST',
        // }).then(res => res.json());
        const company = this.authService.getCurrentUser()?.get('company')
        return Parse.Cloud.run('getClients',{companyId:company.id,data})
    }

    async createClient(client: Client): Promise<Client> {
        // return await fetch('http://localhost:1337/parse/functions/createClient', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(client),
        // }).then(res => res.json());
        const company = this.authService.getCurrentUser()?.get('company')
        if(client.get('img')){
            await client.img.save()
        }
        const result = await Parse.Cloud.run('createClient',{name:client.get('name'),phone:client.get('phone'),img:client.get('img'),company:company.id})
        return result.result
    }
    async deleteClient(client:Client): Promise<Client>{
        return Parse.Cloud.run('deleteClient',{id:client.id})
    }
    async deleteSelectedClients(clients:Client[]){
        return Promise.all(clients.map(client => this.deleteClient(client)))
    }

    async updateClient(client:Client){
        if(client.get('img')){
            await client.img.save()
        }
        return Parse.Cloud.run('updateClient',{id:client.id,name:client.get('name'),phone:client.get('phone'),img:client.get('img')})
    }
  }