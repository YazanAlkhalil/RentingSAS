import { Role } from "parse";

Parse.Cloud.define("isAdmin", async (request) => {
    console.log("====================")
    console.log(request.user, 'request.user');
    console.log(request.user, 'request.user');
    console.log(request.user, 'request.user');
    console.log(request.user, 'request.user');
    console.log("====================")
    const user = request.user;
    const query = new Parse.Query(Role);
    query.equalTo("users", user);
    const roles = await query.find({useMasterKey: true});
    return roles.some(role => role.get("name") === "admin");
});
