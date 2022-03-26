var sqlitedb = require('./../models/db/sqlitedb'),
    conn = sqlitedb.openDBConnection();

var getCategoryList = () => {
    return new Promise((resolve, reject) => {
        if(!conn) {
            return reject({code: 500, errMsg: "db connection failed"});
        }

        var GetCategoryList = 'select * from category;';
        conn.all(GetCategoryList, (err, data) => {
            if(err){
                console.log('get category list err', err.message);
                return reject({code: 500, errMsg: err.message});
            } else if(data) {
                var res = data.map(obj => {
                    return obj;
                });
                resolve(res);
            } else {
                reject({code: 400, errMsg: "Some error occured!"});
            }
        });
    });
};

var addCategory = (list) => {
    return new Promise((resolve, reject) => {
        var insertQuery = 'insert into category(name) values ',
            placeholder;

        if(list && list.length > 0) {
            placeholder = list.map(item => '(?)').join(',');
            insertQuery += placeholder;

            if(!conn) {
                return reject({code: 500, errMsg: "db connection failed"});
            }

            conn.run(insertQuery, list, (err, data) => {
                if(err) {
                    console.log("insert category list errMsg: ", err.message);
                    return reject({code: 500, errMsg: err.message});
                }

                console.log('data', data);

                return resolve(data);
            });
        } else {
            return reject({code: 400, errMsg: "empty list"});
        }
    });
}

var updateCategory = (id, value) => {
    return new Promise((resolve, reject) => {
        var updateQuery = 'update category set name=? where id=?;';

        if(id && value) {
            if(!conn) {
                return reject({code: 500, errMsg: "db connection failed"});
            }

            conn.run(updateQuery, [value, id], (err, data) => {
                if(err) {
                    console.log("update category errMsg: ", err.message);
                    return reject({code: 500, errMsg: err.message});
                }

                return resolve(data);
            });
        } else {
            return reject({code: 400, errMsg: "id or category name is missing"});
        }
    });
}

var deleteCategory = (id) => {
    return new Promise((resolve, reject) => {
        var deleteQuery = 'delete from category where id=?;';

        if(id) {
            if(!conn) {
                return reject({code: 500, errMsg: "db connection failed"});
            }

            conn.run(deleteQuery, id, (err, data) => {
                if(err) {
                    console.log("delete category errMsg: ", err.message);
                    return reject({code: 500, errMsg: err.message});
                }

                return resolve(data);
            });
        } else {
            return reject({code: 400, errMsg: "id is missing"});
        }
    });
}

var fullMenu = () => {
    return new Promise((resolve, reject) => {
        if(!conn) {
            return reject({code: 500, errMsg: "db connection failed"});
        }

        var GetFullMenuList = 'select m.id, m.cid, c.name as cname, m.item, m.shortdesc, m.fullprice, m.halfprice, m.foodtype, m.available from menu as m, category as c where m.cid = c.id;';
        conn.all(GetFullMenuList, (err, data) => {
            if(err){
                console.log('get full menu list err', err.message);
                return reject({code: 500, errMsg: err.message});
            } else if(data) {
                var res = data.map(obj => {
                    return obj;
                });
                resolve(res);
            } else {
                reject({code: 400, errMsg: "Some error occured!"});
            }
        });
    });
};

var availableMenu = () => {
    return new Promise((resolve, reject) => {
        if(!conn) {
            return reject({code: 500, errMsg: "db connection failed"});
        }

        var GetAvailableMenuList = 'select m.id, m.cid, c.name as cname, m.item, m.shortdesc, m.fullprice, m.halfprice, m.foodtype, m.available from menu as m, category as c where available="yes" and m.cid = c.id;';
        conn.all(GetAvailableMenuList, (err, data) => {
            if(err){
                console.log('get available menu list err', err.message);
                return reject({code: 500, errMsg: err.message});
            } else if(data) {
                var res = data.map(obj => {
                    return obj;
                });
                resolve(res);
            } else {
                reject({code: 400, errMsg: "Some error occured!"});
            }
        });
    });
};

var addMenu = (list) => {
    return new Promise((resolve, reject) => {
        var insertQuery = 'insert into menu(cid, item, shortdesc, fullprice, halfprice, foodtype, available) values ',
            placeholder,
            paramlist = [];

        if(list && list.length > 0) {
            placeholder = list.map((obj, index) => {
                paramlist.push(obj.cid);
                paramlist.push(obj.item);
                paramlist.push(obj.shortdesc);
                paramlist.push(obj.fullprice);
                paramlist.push(obj.halfprice);
                paramlist.push(obj.foodtype);
                paramlist.push(obj.available);

                return '(?,?,?,?,?,?,?)';
            });
            insertQuery += placeholder.join(',');

            console.log("insertQuery: ", insertQuery, "paramlist:", paramlist);

            if(!conn) {
                return reject({code: 500, errMsg: "db connection failed"});
            }

            conn.run(insertQuery, paramlist, (err, data) => {
                if(err) {
                    console.log("insert menu list errMsg: ", err.message);
                    return reject({code: 500, errMsg: err.message});
                }

                return resolve(data);
            });
        } else {
            return reject({code: 400, errMsg: "empty list"});
        }
    });
}

var uploadMenu = async (list) => {
    var categoryIds = await getCategoryList();
    console.log('categoryIds', categoryIds);

    var categoryIdObj = {},
        newCategories = [];

    categoryIds.map(cobj => {
        categoryIdObj[cobj.name] = cobj.id;
    });

    list.map(item => {
        if(categoryIdObj[item.cname]) {
            item.cid = categoryIdObj[item.cname];
        } else {
            newCategories.push(item.cname);
        }
    });

    console.log('newCategories', newCategories);
    console.log('list', list);

    if(newCategories.length > 0) {
        await addCategory(newCategories);
        categoryIds = await getCategoryList();
        categoryIds.map(cobj => {
            categoryIdObj[cobj.name] = cobj.id;
        });

        list.map(item => {
            item.cid = categoryIdObj[item.cname];
        });
    }

    console.log('list', list);
    return addMenu(list);
}

var updateMenu = (paramlist, id) => {
    return new Promise((resolve, reject) => {
        var updateQuery = 'update menu set cid=?, item=?, shortdesc=?, fullprice=?, halfprice=?, foodtype=?, available=? where id=?;';

        if(id) {
            if(!conn) {
                return reject({code: 500, errMsg: "db connection failed"});
            }

            conn.run(updateQuery, paramlist, (err, data) => {
                if(err) {
                    console.log("update category errMsg: ", err.message);
                    return reject({code: 500, errMsg: err.message});
                }

                return resolve(data);
            });
        } else {
            return reject({code: 400, errMsg: "id is missing"});
        }
    });
}

var deleteMenu = (id) => {
    return new Promise((resolve, reject) => {
        var deleteQuery = 'delete from menu where id=?;';

        if(id) {
            if(!conn) {
                return reject({code: 500, errMsg: "db connection failed"});
            }

            conn.run(deleteQuery, id, (err, data) => {
                if(err) {
                    console.log("delete menu errMsg: ", err.message);
                    return reject({code: 500, errMsg: err.message});
                }

                return resolve(data);
            });
        } else {
            return reject({code: 400, errMsg: "id is missing"});
        }
    });
}

exports.repository = {
    getCategoryList,
    addCategory,
    updateCategory,
    deleteCategory,
    fullMenu,
    availableMenu,
    addMenu,
    uploadMenu,
    updateMenu,
    deleteMenu
}