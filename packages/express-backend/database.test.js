import { jest } from '@jest/globals';
import db from "./database.js";


test('Getting user', async () => {
    var result = await db.get_user({email: "corbyn@rasque.dev"})
    console.log(result);

    // console.log(result);
    expect(1).toBe(1);
});