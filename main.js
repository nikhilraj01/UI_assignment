var currentPath="";
var cm=document.getElementById("contextMenu");
var selectedFilePath="";
var fileName="";
var moveOrCopy="";
var fileToPaste="";
var lastSelRow;
var empty;
var months=["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

function initFolders(path="/") { currentPath=path;
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
                row.addEventListener("dblclick", function()
                {
                    var img=path.substring(path.length-3,path.length);
                    if(img.toUpperCase()=="PNG" || img.toUpperCase()=="JPG" )
                    {
                        var modal = document.getElementById("Modal");
                        modal.style.display = "block";
                        var modalImg = document.getElementById("img");
                        var imgCaption = document.getElementById("caption");
                        imgCaption.innerHTML = path;
                        modalImg.src = "http://localhost:9000/filemanager?mode=getimage&path="+path+"&thumbnail=true";
                        var span = document.getElementsByClassName("close")[0];
                        span.onclick = function()
                        {
                            modal.style.display = "none";
                        }
                    }
                    else
                    {
                        initFolders(path);
                    }
                });
                row.addEventListener("keypress", function(e)
                {
                    if ( e.keyCode == 13 ){
                        var img=path.substring(path.length-3,path.length);
                        if(img.toUpperCase()=="PNG" || img.toUpperCase()=="JPG" )
                        {                                
                            window.open("http://localhost:9000/filemanager?mode=getimage&path="+path+"&thumbnail=true", "_target");
                        }
                        else
                        {
                            initFolders(path);
                        }
                    }
                });
                row.addEventListener("contextmenu", (e)=>
                {
                    fileName=e.target.textContent;
                    selectedFilePath=currentPath+fileName;
                    e.preventDefault();
                    showContextMenu();
                    cm=document.getElementById("contextMenu");
                    cm.style.top=e.clientY;
                    cm.style.left=e.clientX;                
                });
                row.addEventListener("click" , (e)=>
                {
                    if(lastSelRow)
                    {
                        lastSelRow.style.opacity=1;
                        lastSelRow.style.border="black";
                        lastSelRow.style.backgroundColor="white";
                    }
                    var onsel=document.getElementById("onselect");
                    onsel.style.opacity=1.0;
                    row.style.border="grey 3px solid";
                    row.style.backgroundColor="rgba(190, 190, 190, 0.692)";
                    fileName=e.target.textContent;
                    selectedFilePath=currentPath+fileName;
                    lastSelRow=row;  
                    getInfo();  
                }); 
                row.tabIndex=0; 
                nm.textContent=element.attributes.name;
                mod.textContent=months[element.attributes.modified.substring(6,7)-1]+
                " "+element.attributes.modified.substring(8,10)+
                ", "+element.attributes.modified.substring(0,4);
                row.appendChild(nm);
                row.appendChild(mod);            
                table.appendChild(row);
            });
        }
        if(table.children.length==1){
            empty="true";
            var row=document.createElement("tr");                   
            nm = document.createElement("td"); 
            nm.textContent="The folder is empty";
            nm.colSpan=2;
            row.appendChild(nm);
            table.appendChild(row);
            row.addEventListener("contextmenu", (e)=>
            {
                fileName=e.target.textContent;
                selectedFilePath=currentPath+fileName;
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
    var res = currentPath.split("/");  
    var path;
    var str="";
    var pathArr=[];
    for(i=1;i<res.length;i++)
    {
        res[i]="/"+res[i];
        var item = document.createElement("li");
        item.innerHTML=item.innerHTML+res[i];
        path="";
        for(j=1;j<=i;j++)
        {
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
window.addEventListener("keydown", function(e)
{
    if ( e.keyCode == 8 )
    {
        back();
    }
});
window.addEventListener("click", (e)=>
    { 
        showContextMenu(false);
        var onsel=document.getElementById("onselect"); 
        if(e.srcElement.tagName!="TD"){
            if(lastSelRow){
                lastSelRow.style.opacity=1;
                lastSelRow.style.border="black";
                lastSelRow.style.backgroundColor="white";
            }
            onsel.style.opacity=0.0;                  
        } 
});
function back()
{
    var newPath=currentPath.substring(0,currentPath.length-1);   
    var n=newPath.lastIndexOf("/"); 
    newPath=newPath.substring(0,n+1);;
    if(newPath.lastIndexOf("/")!=-1){
        initFolders(newPath);  
    } 
}
function showContextMenu(show=true)
{
    var cm=document.getElementById("contextMenu");
    cm.style.display=show? "block" : "none";
}
function popNewFold() {
    document.getElementById("foldName").style.display = "block";
  }
function closePopFolder() {
    document.getElementById("foldName").style.display = "none";
}
function newFolder(){
    fname=document.getElementById("folderName").value;
    fetch("http://localhost:9000/filemanager?mode=addfolder&path="+(currentPath)+"&name="+(fname))
    .then(function(response) {
        initFolders(currentPath);
        })
        closePopFolder();
}
function fileUpload()
{
    var file = document.getElementById("uploadedFile").files[0];
    console.log(file)
    var data = {"mode": "upload",  "path": "/New Folder"};
    var options = 
    {
        method: 'POST',
        body: JSON.stringify(data)
    }
fetch('http://localhost:9000/filemanager', options);
}
function copyItem(){
    moveOrCopy=1;
    fileToPaste=selectedFilePath;
}
function moveItem(){
    moveOrCopy=2;
    fileToPaste=selectedFilePath;
}
function pasteItem(){
    if(moveOrCopy==1)
    {
        fetch("http://localhost:9000/filemanager?mode=copy&source=" + (fileToPaste) + "&target="+ (currentPath))
    .then(function(response) {
        initFolders(currentPath);
        })
    }
    else if(moveOrCopy==2)
    {
        fetch("http://localhost:9000/filemanager?mode=move&old=" + (fileToPaste) + "/&new=" + (currentPath))
    .then(function(response) {
        initFolders(currentPath);
        })
    }
    else{
        alert("No item selected for pasting");
    }
}
function popRename() {
    if(empty=="true"){
        alert("No file selected to rename");
    }
    else
    {
        document.getElementById("itemRename").style.display = "block";
    }
}
function closePopRename() {
    document.getElementById("itemRename").style.display = "none";
}
function renameitem()
{
    fname=document.getElementById("newfolderName").value;
    fetch("http://localhost:9000/filemanager?mode=rename&old="+(selectedFilePath)+ "&new=" + (fname))
    .then(function(response) {
        initFolders(currentPath);
        })
        closePopRename();    
}
function confirmDelete() 
{
    if(empty=="true"){
        alert("No file selected to delete");
    }
    else
    {
        document.getElementById("itemDelete").style.display = "block";
    }
}
function closePopDelete() {
    document.getElementById("itemDelete").style.display = "none";
}
function deleteItem()
{
    fetch("http://localhost:9000/filemanager?mode=delete&path="+(selectedFilePath))
    .then(function(response) {
        initFolders(currentPath);
        })
        closePopDelete();
}
function getInfo(){
    fetch("http://localhost:9000/filemanager?mode=getinfo&path="+(selectedFilePath))
    .then(function(response){
        var info=response;       
        
        console.log(info);
    })
}
