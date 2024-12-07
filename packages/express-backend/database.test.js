import { jest } from '@jest/globals';
import db from "./database.js";

var user;
const email = "a";
const domain_id = 1;

test('User Tests', async () => {
    var id, user;

    await expect(db.get_user({email}).then((result) => user = result)).resolves.toHaveProperty('password');
    await expect(db.get_user_id({email}).then((result) => id = result)).resolves.toHaveProperty('id');
    if (id && user) {
        await expect(db.update_user(id.id, {...user, password: user.password + 'a'})).resolves.toBeTruthy();
        await expect(db.remove_user(id.id)).resolves.toBeTruthy();
        await expect(db.add_user(user)).resolves.toHaveProperty('id');
    }
});

test('User Domain Tests', async () => {
    var domain_id;
    await expect(db.get_user_id({email}).then((id) => user = id)).resolves.toHaveProperty('id');

    if(user) {
        await expect(db.add_user_domain(user.id, {name: "a", end: new Date()}).then((result) => domain_id = result)).resolves.toBeTruthy();
    }
    if(user && domain_id) {
        await expect(db.get_user_domains(user.id)).resolves.toBeTruthy();
    }
});

test('Domain Tests', async () => {
    var child;

    await expect(db.get_domains_by_user_domain(domain_id)).resolves.toBeTruthy();
    await expect(db.get_subdomains_and_tasks(domain_id)).resolves.toBeTruthy();
    await expect(db.get_tasks(domain_id)).resolves.not.toThrow();

    await expect(db.add_domain(domain_id, {name: "a", end: new Date()}).then((result) => child = result)).resolves.toBeTruthy();
    await expect(db.update_domain(child[0].child_id, {name: "b", end: new Date()})).resolves.toBeGreaterThan(0);
    await expect(db.remove_domain(child[0].child_id)).resolves.toBeTruthy();
});

test('Task & List Items Tests', async () => {
    var task, list_item;

    await expect(db.add_task(domain_id, {name: "a", notes: "", do: null, due: null, completed: false}).then((result) => task = result[0])).resolves.toBeTruthy();
    await expect(db.update_task(task.id, {name: "a", notes: "", do: null, due: null, completed: true})).resolves.toBeTruthy();

    await expect(db.add_list_item(task.id, {name: 'a'}).then((result) => list_item = result[0])).resolves.toBeTruthy();
    await expect(db.update_list_item(list_item.id, {name: 'a', completed: true})).resolves.toBeTruthy();

    await expect(db.get_list_items_by_task(task.id)).resolves.not.toBeFalsy();

    await expect(db.remove_list_item(list_item.id)).resolves.toBeTruthy();
    await expect(db.remove_task(task.id)).resolves.toBeTruthy();
})