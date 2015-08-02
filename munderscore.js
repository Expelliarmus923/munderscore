/**
 * Created by lulizhou on 2015/7/18.
 */
    var NativeKey=Object.keys;
    var objProto=Object.prototype,arrProto=Array.prototype;
    var hasOwnProperty=objProto.hasOwnProperty;
    var _ = function(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };
/*Object相关函数*/
    //_.keys方法，返回由对象key组成的数组
    _.keys=function(obj){
        if(NativeKey) return NativeKey(obj);
        /*兼容IE8-*/
        var key=[];
        for(var value in obj){
            key.push(value);
        }
        return key;
    }
    _.value=function(obj){
    var value=[];
       /* for(var i in obj){
            value.push(obj[i]); //兼容性??
        }*/
        var keys= _.keys(obj);
        for(var i=0;i<keys.length;i++){
            value[i]=obj[keys[i]];
        }
        return value;
    }
    _.mapObject=function(object, iteratee, context){
        iteratee=isContent(iteratee,context);
        var keys= _.keys(object),
            length=keys.length,
            result={};
        for(var index=0;index<length;index++){
            var currentKey=keys[index];
            result[currentKey]=iteratee(object[currentKey],currentKey,object);
        }
        return result;
    }
    _.pairs=function(obj){
        var keys= _.keys(obj),
            length=keys.length,
            result=[];
        for(var index=0;index<length;index++){
            result[index]=[keys[index],obj[keys[index]]];
        }
        return result;
    }
    _.invert=function(obj){
        var keys= _.keys(obj),
            length=keys.length,
            result={};
        for(var index=0;index<length;index++){
            result[obj[keys[index]]]=keys[index];
        }
        return result;
    }
    _.functions=function(obj){
        var names=[];
        for(var key in obj){
            names.push(key)
        }
        return names.sort();
    }
    _.findKey=function(object, predicate, context){
        predicate=isContent(predicate,context);
        var keys= _.keys(object);
        for(var index=0;index<keys.length;index++){
            if(predicate(object[keys[index]],keys[index],object)){
                return keys[index];
            }
        }
    }
    _.pick=function(object){
        var keys= _.keys(object);
        var result={},value,key;
        switch (typeof arguments[1]){
            case "function":  //判断第二个参数是不是函数
                fn=arguments[1];
                for(var index=0;index<keys.length;index++){
                    value=object[keys[index]];
                    key=keys[index];
                    if(fn(value,key,object))
                        result[keys[index]]=object[keys[index]];
                }
                break;
            case "string":
                for(var i=1;i<arguments.length;i++){
                    for(var index=0;index<keys.length;index++){
                        if(keys[index]==arguments[i]){
                            result[keys[index]]=object[keys[index]];
                        }
                    }
                }
                break;
        }
        return result;

    }
    _.omit=function(object){
            var keys= _.keys(object);
            var result=object,value,key;
            switch (typeof arguments[1]){
                case "function":  //判断第二个参数是不是函数
                    fn=arguments[1];
                    for(var index=0;index<keys.length;index++){
                        value=object[keys[index]];
                        key=keys[index];
                        if(fn(value,key,object))
                            delete  result[keys[index]]
                    }
                    break;
                case "string":
                    for(var i=1;i<arguments.length;i++){
                        for(var index=0;index<keys.length;index++){
                            if(keys[index]==arguments[i]){
                                delete  result[keys[index]]
                            }
                        }
                    }
                    break;
            }
            return result;
        }
    _.isArray=function(obj){
        return arrayLike(obj);
    }
    _.has=function(obj,key){
        return obj!=null && hasOwnProperty.call(obj,key);
    }
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var arrayLike=function(obj){
        var length=obj.length;
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    }
    _.isObject= function (obj) {
    var type=typeof obj;
    return type==='function'||type==='object'&&!!obj;
    }
    _.isArguments=function(object){
        return _.has(object,'callee');
    }
    _.isFunction=function(object){
        return typeof object=='function';
    }
    _.isEmpty=function(obj){
        if(obj==null) return true;
        if(_.isArray(obj)) return obj.length===0;
        return _.keys(obj).length===0;
    }
    _.isMatch=function(obj,attr){
        var keys= _.keys(attr),length=keys.length;
        if(obj==null)return !length;
        var object=Object(obj);
        for(var i=0;i<length;i++){
            var key=keys[i];
            if(attr[key]!==obj[key]||!(key in obj)) return false;
        }
        return true;
    }
    _.matcher=function(attrs){
        return function(obj){
            return _.isMatch(obj,attrs)
        }
    }
/*Collections相关函数*/
    /*_.each方法
     *content作用绑定fn的this
     * obj若是数组，fn接受三个参数：item，index，obj;
     * obj若是对象，fn接受三个参数是：value, key, list；
     * */
    var isContent=function(fn,content){
        if(content==void 0){
            return fn;
        }else{
            return function(item,index,obj){
                return fn.call(content,item,index,obj);
            }
        }
    }
    _.each=function(obj,fn,content){
        fn=isContent(fn,content);
        if(obj.length){
            if(Array.prototype.forEach) obj.forEach(fn); //若原生forEach存在则使用
            else for(var index=0;index<obj.length;index++){
                fn(obj[index],index,obj);
            }
        }else{
            var keys= _.keys(obj);
            for(var index=0;index<keys.length;index++){
                fn(obj[keys[index]],keys[index],obj);
            }
        }
    }
    _.findIndex=function(array, predicate, context){
        predicate=isContent(predicate,context);
        if(arrayLike(array)){
            for(var index=0;index<array.length;index++){
                if(predicate(array[index],index,array)){
                    return index;
                }
            }
            return -1;
        }
    }
/*
* map方法：返回执行完指定函数后的数值或对象
* */
    _.map=function(obj,fn,content){
        fn=isContent(fn,content);
        if(obj.length&&Array.prototype.map) return obj.map(fn);//若原生map存在则使用
        var keys=!obj.length&& _.keys(obj),
            length=(keys||obj).length,
            result=[];
                for(var index=0;index<length;index++){
                    var iCurrIndex=keys?keys[index]:index;
                    result.push(fn(obj[iCurrIndex],iCurrIndex,obj));
                }
        return result;
    }
    _.reduce=function(list, iteratee, memo, context){
        iteratee=isContent(iteratee,context);
        var keys=!list.length&& _.keys(list),
            length=(keys||list).length;
        var index=0;
        var memoInit = memo==void 0 ? list[keys?keys[index]:index] : memo;
        if(list.length&&Array.prototype.reduce) return memoInit+list.reduce(iteratee);
         for(;index<length;index++){
            var iCurrIndex=keys?keys[index]:index;
             memoInit=iteratee(memoInit,list[iCurrIndex],iCurrIndex,list);
        }
        return memoInit;
    }
    _.find=function(list,predicate,content){
        var key;
        if(arrayLike(list)){
            key= _.findIndex(list,predicate,content);
        }else{
            key= _.findKey(list,predicate,content);
        }
        if(key!=void 0&&key!=-1)return list[key];
    }
    _.findWhere=function(list, properties){
            return _.find(list, _.matcher(properties));
    }
    /*只传数值*/
    _.filter=function(list,predicate,context){
        predicate=isContent(predicate,context);
        if(arrayLike(list)&&Array.prototype.filter) return list.filter(predicate);
        var result=[];
        _.each(list,function(item,index,obj){
            if(predicate(item,index,obj)){
                result.push(item);
            }
        })
    }
    _.reject=function(list,predicate,context){
    predicate=isContent(predicate,context);
    var result=[];
    _.each(list,function(item,index,obj){
        if(!predicate(item,index,obj)){
            result.push(item);
        }
    })
    }
    _.every=function(list,predicate,context){
    predicate=isContent(predicate,context);
     if(arrayLike(list)&&Array.prototype.filter) return list.every(predicate);
        var keys=!list.length&& _.keys(list),
            length=(keys||list).length;
        for(var index=0;index<length;index++){
            var iCurrIndex=keys?keys[index]:index;
           if(!predicate(list[iCurrIndex],iCurrIndex,list)) {
               return false;
           }
        }
        return true;
    }
    _.some=function(list,predicate,context){
    predicate=isContent(predicate,context);
    if(arrayLike(list)&&Array.prototype.filter) return list.some(predicate);
    var keys=!list.length&& _.keys(list),
        length=(keys||list).length;
    for(var index=0;index<length;index++){
        var iCurrIndex=keys?keys[index]:index;
        if(predicate(list[iCurrIndex],iCurrIndex,list)){
            return true;
        }
    }
    return false;

}
    _.pluck=function(list, propertyName){
        var keys=_.keys(list),result=[]
        console.log(keys);
        for(var index=0;index<keys.length;index++){
            var currentKey=list[index], subkeys= _.keys(currentKey);
            for(var value in subkeys){
                if(subkeys[value]==propertyName){
                    result.push(currentKey[propertyName]);
                }
            }
        }
        return result;
    }
//数组方法 arry
    //返回array（数组）的第一个元素。传递 n参数将返回数组中从第一个元素开始的n个元素
    _.first=function(list,n){
        if(list==null) return void 0;
        if(n==null) return list[0];
        return Array.prototype.slice.call(list,0,n);
    }
    //返回数组中除了最后一个元素外的其他全部元素。
    _.initial=function(list , n){
        return Array.prototype.slice.call(list,0,Math.max(0,list.length-(n==null?1:n)));
    }
    //返回array（数组）的最后一个元素。传递 n参数将返回数组中从最后一个元素开始的n个元素
    _.last=function(list,n){
        if(list==null) return void 0;
        if(n==null) return list[list.length-1];
        return Array.prototype.slice.call(list,list.length-n);
    }
    //返回数组中除了第一个元素外的其他全部元素。传递 index 参数将返回从index开始的剩余所有元素 。
    _.rest=function(list,index){
        if(list==null) return void 0;
        return Array.prototype.slice.call(list,(index==null?1:index));
    }
    //返回一个除去所有false值的 array副本。 在javascript中, false, null, 0, "", undefined 和 NaN 都是false值.
    _.compact=function(list){
        return _.filter(list,function(value){return value});
    }
//已数组的形式返回argument是number的参数
    var restArguments=function(){
        var result=[];
            for(var index=0;index<arguments.length;index++){
                if(typeof arguments[index]=='number'){
                result.push(arguments[index]);
                }
            }
        return result;
    }
    _.without=function(list){
        var values=restArguments.apply(this,arguments);
        return _.difference(list,values);
    }
    _.difference=function(list,values){
      return  _.filter(list,function(item){
            for(var index=0;index<values.length;index++){
             if(item===values[index])
             return false;
            }
          return true;
        });
    }
    _.union=function(){}
    _.intersection=function(){}
    _.uniq=function(){}
    _.zip=function(){}