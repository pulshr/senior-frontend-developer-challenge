import React, { useState } from 'react';
import { JSONPatch } from 'jsonpatch';
import ReactJson from 'react-json-view';

function App() {
  const[inputObjectString,setInputObjectString] = useState('Input Object String Here...');
  const[inputPatchString,setInputPatchString] = useState('Input Patch Operations String Here...');
  const[isPatching,setIsPatching] = useState(false);
  const[currentObject,setCurrentObject] = useState(null);
  const[currentPatchOperation,setCurrentPatchOperation] = useState(0);
  const[remainingPatchOperations,setRemainingPatchOperations] = useState([]);

  const startPatching = () => {
    try{
      setCurrentObject(JSON.parse(inputObjectString));
      setRemainingPatchOperations(JSON.parse(inputPatchString.replace(/ /g, '')));
      setIsPatching(true);
    } catch(err) {
      alert('Invalid object or parse string');
      setIsPatching(false);
    }
  }
  
  const clearInputFields = () => {
    setInputObjectString('');
    setInputPatchString('');
    alert('Input Fields Cleared');
  }

  const applyPatchOperation = (index) => {
    try{
      setCurrentObject((new JSONPatch([remainingPatchOperations[index]])).apply(currentObject));
      const updatedRemainingOperations = JSON.parse(JSON.stringify(remainingPatchOperations));
      updatedRemainingOperations.splice(index,1);
      setRemainingPatchOperations(updatedRemainingOperations);
      setCurrentPatchOperation(0);
    } catch(err) {
      alert('Invalid patch operation');
    }
  }

  const rejectPatchOperation = () => {
    const updatedRemainingOperations = JSON.parse(JSON.stringify(remainingPatchOperations));
    updatedRemainingOperations.splice(currentPatchOperation,1);
    setRemainingPatchOperations(updatedRemainingOperations);
    setCurrentPatchOperation(0);
  }

  return (
    <div>
      {!isPatching && <div style={{width:1500,height:700,alignContent:'center',display: 'flex', flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
      <div style={{display:'flex', flexDirection:'row'}}>
        <textarea disabled={isPatching} value={inputObjectString} onChange={(e)=>{setInputObjectString(e.target.value)}} style={{width:400,height:500,alignContent:'center',display: 'flex',alignItems: 'center',justifyContent: 'center',border: '1px solid red', margin:20,borderRadius:20,padding:20}}/>
        <textarea disabled={isPatching} value={inputPatchString} onChange={(e)=>{setInputPatchString(e.target.value)}} style={{width:400,height:500,alignContent:'center',display: 'flex',alignItems: 'center',justifyContent: 'center',border: '1px solid red', margin:20,borderRadius:20,padding:20}}/>
      </div>  
      <div style={{display: 'flex', flexDirection:'row'}}>
        <button onClick={startPatching} style={{margin:50}}>Start Patching</button>
        <button onClick={clearInputFields} style={{margin:50}}>Clear Input Fields</button>
      </div>
      </div>}
      {isPatching && <div>
        <button onClick={()=>{setIsPatching(false)}} style={{display:'flex',alignSelf:'center',margin:20}}>Reset Input Fields</button>
        <div style={{display:'flex', flexDirection:'row'}}>
          <ReactJson src={currentObject} displayDataTypes={false} displayObjectSize={false} enableClipboard={false} style={{height:600,width:'80%',alignContent:'center',display: 'flex',alignItems: 'center',justifyContent: 'center'}}></ReactJson>
          <div style={{display:'flex', flexDirection:'column'}}>
          {remainingPatchOperations.map((operation, index) => (
                  <div onClick={() => {setCurrentPatchOperation(index)}} key={index} style={{height:200,display:'flex', alignItems:'center', border: '1px solid red', margin:20,borderRadius:20,padding:10,backgroundColor:currentPatchOperation===index?'lightgreen':'white'}}>
                    <ReactJson src={operation} displayDataTypes={false} displayObjectSize={false} enableClipboard={false} style={{width:'80%'}}/>
                    <div style={{alignContent:'right',display: 'flex', flexDirection:'column',alignItems: 'right',justifyContent: 'right'}}>
                      <button onClick={()=>{applyPatchOperation(currentPatchOperation)}} style={{margin:20}}>Apply</button>
                      <button onClick={()=>{rejectPatchOperation()}} style={{margin:20}}>Reject</button>
                    </div>
                  </div>
                ))}
          </div>
        </div>      
      </div>}
    </div>
  );
}

export default App;
