var curPath="";
var cm=document.getElementById("contextMenu");
var selectedFilePath="";
var fileName="";
var moveOrCopy="";
var fileToPaste="";
var lastSelRow;



    function initFolders(path="/") { curPath=path;
        fetch("http://localhost:9000/filemanager?mode=readfolder&path="+path)
        .then(function(response) {
            return response.json();
        })
        .then(function (response) {
            var folderTable = document.getElementById("fmListFolders");  
            folderTable.innerHTML="";
            var table=document.createElement("table");
            var head1 = document.createElement("th");                   
            var head2 = document.createElement("th");
            head1.textContent="Name";
            head2.textContent="Date Modified";
            var hrow=document.createElement("tr");
            hrow.appendChild(head1);
            hrow.appendChild(head2);
            table.appendChild(hrow);
            var num=0;       
            if (Array.isArray(response.data)) {
                response.data.forEach(element => {
                    var row=document.createElement("tr");                   
                    nm = document.createElement("td");  
                    mod = document.createElement("td");
                    var path=element.attributes.path;
                    row.addEventListener("dblclick", function(){
                        initFolders(path);
                    });
                    row.addEventListener("contextmenu", (e)=>
                    {
                        fileName=e.target.textContent;
                        selectedFilePath=curPath+fileName;
                        e.preventDefault();
                        showContextMenu();
                        cm=document.getElementById("contextMenu");
                        cm.style.top=e.clientY;
                        cm.style.left=e.clientX;
                    });
                    row.addEventListener("click" , (e)=>
                    {
                        if(lastSelRow){
                            lastSelRow.style.opacity=1;
                            lastSelRow.style.border="black";
                        }
                        var onsel=document.getElementById("onselect");
                        onsel.style.opacity=1.0;
                        row.style.opacity=0.6;
                        row.style.border="grey 3px solid";
                        fileName=e.target.textContent;
                        selectedFilePath=curPath+fileName;
                        lastSelRow=row;
                    });  
                    nm.textContent= element.attributes.name;
                    mod.textContent = element.attributes.modified.substring(0, 10);
                    row.appendChild(nm);
                    row.appendChild(mod);
                    table.appendChild(row);
                });
            }
            if(table.children.length==1){
                var row=document.createElement("tr");                   
                nm = document.createElement("td"); 
                nm.textContent="The folder is empty";
                nm.colSpan=2;
                row.appendChild(nm);
                table.appendChild(row);
                row.addEventListener("contextmenu", (e)=>
                    {
                        fileName=e.target.textContent;
                        selectedFilePath=curPath+fileName;
                        e.preventDefault();
                        showContextMenu();
                        cm=document.getElementById("contextMenu");
                        cm.style.top=e.clientY;
                        cm.style.left=e.clientX;
                    });   
            }
            folderTable.appendChild(table);
        });
        var dirList=document.getElementById("dirList");
        dirList.innerHTML="";
        var res = curPath.split("/");  
        var path;
        var str="";
        var pathArr=[];
        for(i=1;i<res.length-1;i++){
            res[i]="/"+res[i];
            var item = document.createElement("li");
            item.innerHTML=item.innerHTML+res[i];
            path="";
            for(j=1;j<=i;j++){
                path=path+res[j];
            }
            pathArr[i]=path;
            item.addEventListener("click" , (e)=>
            {
                str=e.target.textContent;
                initFolders(pathArr[res.indexOf(str)]);
                
            });
            dirList.appendChild(item);
    }
    }
    window.addEventListener("click", (e)=>
    { 
        showContextMenu(false);
        var onsel=document.getElementById("onselect"); 
        if(e.srcElement.tagName!="TD"){
            if(lastSelRow){
                lastSelRow.style.opacity=1;
                lastSelRow.style.border="black";
            }
            onsel.style.opacity=0.0;                  
        } 
});

function back()
{
    var new_path=curPath.substring(0,curPath.length-1);   
    var n=new_path.lastIndexOf("/"); 
    new_path=new_path.substring(0,n+1);;
    if(new_path.lastIndexOf("/")!=-1){
        initFolders(new_path);  
    } 
}

function showContextMenu(show=true)
{
    var cm=document.getElementById("contextMenu");
    cm.style.display=show? "block" : "none";
}

function popfoldnm() {
    document.getElementById("fold_name").style.display = "block";
  }
function closepopfolder() {
    document.getElementById("fold_name").style.display = "none";
}
function api_new_folder(){
    fname=document.getElementById("foldername").value;
    fetch("http://localhost:9000/filemanager?mode=addfolder&path="+(curPath)+"&name="+(fname))
    .then(function(response) {
        initFolders(curPath);
        })
        closepopfolder();
}


function api_file_upload()
{
    var objFile={
        "id": "/Capture.PNG",
        "type": "file",
        "attributes": {
            "name": "Capture.PNG",
            "path": "/Capture.PNG",
            "readable": 1,
            "writable": 1,
            "created": 1477235998,
            "modified": 1477235998,
            "height": 128,
            "width": 128,
            "size": 15664
        }
    }
    var file = document.getElementById("uploadedFile").files[0];
    console.log(file)
    var data = {"mode": "upload",  "path": "/New Folder"};
    var options ={method: 'POST',
    body: JSON.stringify(data)
}
fetch('http://localhost:9000/filemanager', options);
}

function copyitem(){
    moveOrCopy=1;
    fileToPaste=selectedFilePath;
}
function moveitem(){
    moveOrCopy=2;
    fileToPaste=selectedFilePath;
}
function pasteitem(){
    if(moveOrCopy==1)
    {
    fetch("http://localhost:9000/filemanager?mode=copy&source=" + (fileToPaste) + "&target="+ (curPath))
    .then(function(response) {
        initFolders(curPath);
        })
    }
    else if(moveOrCopy==2)
    {
        fetch("http://localhost:9000/filemanager?mode=move&old=" + (fileToPaste) + "/&new=" + (curPath))
    .then(function(response) {
        initFolders(curPath);
        })
    }
    else
    alert("No item selected for pasting");
}

function poprenm() {
    document.getElementById("item_rename").style.display = "block";
  }
function closepoprenm() {
    document.getElementById("item_rename").style.display = "none";
}
function renameitem()
{
    fname=document.getElementById("newfoldername").value;
    fetch("http://localhost:9000/filemanager?mode=rename&old="+(selectedFilePath)+ "&new=" + (fname))
    .then(function(response) {
        initFolders(curPath);
        })
        closepoprenm();    
}

function confirmdelete() {
    document.getElementById("item_delete").style.display = "block";
  }
function closepopdelete() {
    document.getElementById("item_delete").style.display = "none";
}
function deleteitem()
{
    fetch("http://localhost:9000/filemanager?mode=delete&path="+(selectedFilePath))
    .then(function(response) {
        initFolders(curPath);
        })
        closepopdelete();
}
