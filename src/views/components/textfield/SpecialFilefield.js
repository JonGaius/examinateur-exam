import React, { useState } from 'react';
import CancelIcon from '../../../assets/icons/ui/CancelIcon';
import EyeIcon from '../../../assets/icons/ui/EyeIcon';
import TrashIcon from '../../../assets/icons/ui/TrashIcon';
import PDFViewer from '../pdf/PDFViewer';

const SpecialFilefield = ({id, fnc, type, deleteFnc, children}) => {
    const [text, setText] = useState("Cliquer pour ajouter un fichier");
    const [file, setFile] = useState("");
    const [typeF, setTypeF] = useState("");
    const [fileURL, setFileURL] = useState("");

    const onChangeFile = (e) => {
        
        let fileR = e.target.files[0]
        setTypeF(fileR.type)
        setFileURL(URL.createObjectURL(fileR))
        let name = fileR.name.split('.').slice(0, -1).join('.');
        setText(name)
        setFileBase(fileR)

    } 

    const setFileBase = (fichier) => {
        const reader = new FileReader()
        reader.readAsDataURL(fichier)
        reader.onloadend = () => {
            setFile(reader.result)
            let data = {
                nom: fichier.name.split('.').slice(0, -1).join('.'),
                data_en_base64: reader.result,
                type_de_fichier: parseInt(type.value)
            }
            fnc(data)
        }
    }
    return (
        <div className='sigepec-filefield'>
            <label htmlFor={id}>
                {children}
            </label>
            <input id={id} type="file" accept='.png,.jpg,.jepg,.pdf' onChange={onChangeFile}/>
            <div className='sigepec-filefield__content'>
                <div className='sigepec-filefield__texte'>
                    {
                        file ? (
                            <>
                            <span>Nom du fichier: </span>
                            <strong>{text}</strong>
                            </>
                        ) : (

                            <label htmlFor={id}>{text}</label>
                        )
                    }
                </div>
                {
                    file && (
                    <div className='sigepec-filefield__actions'>                     
                        <button type='button' className='sigepec-button-icon sigepec-button-icon--normal' onClick={() => {
                            document.getElementById("preview-"+id).classList.add("is--show")
                        }}>
                            <EyeIcon/> <span>Apercu</span>
                        </button>                  
                        <button type='button' className='sigepec-button-icon sigepec-button-icon--delete' onClick={() => {
                                deleteFnc(type.value)
                                setFile("")
                                setText("Cliquer pour ajouter un fichier")
                            }}>
                            <TrashIcon/> <span>Supprimer</span>
                        </button>
                    </div>
                    )
                }
                
            </div>
            {
                file && (
                <div className='sigepec-filefield__preview sigepec-filefield-preview' id={"preview-"+id}>
                    <button className='sigepec-filefield-preview__close' type='button' onClick={() => {
                        document.getElementById("preview-"+id).classList.remove("is--show")
                    }}>
                        <CancelIcon/>
                    </button>
                    <div className='sigepec-filefield-preview__container'>
                        {
                            typeF === "image/jpeg" ? (
                                // Image
                                <img src={fileURL} alt="file-preview" />
                            ) : (
                                // PDF
                                <PDFViewer url={fileURL}/>
                            )
                        }

                    </div>
                </div>
                )
            }
            
        </div>
    );
};

export default SpecialFilefield;