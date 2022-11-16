import React from 'react';
import CancelIcon from '../../../assets/icons/ui/CancelIcon';
import EyeIcon from '../../../assets/icons/ui/EyeIcon';
import PDFViewer from '../pdf/PDFViewer';

const PreviewFile = ({url, id ,name}) => {
    let type = url.split('.').pop()
    return (
        <div className='sigepec-info-file-preview'>
            <div className='sigepec-info-file-preview__container'>
                <div className='sigepec-info-file-preview__text'>
                    <span>Nom du fichier</span> <br />
                    <strong>{name}</strong>
                </div>
                <button type='button' className='sigepec-button-icon sigepec-button-icon--normal' onClick={() => {
                        document.getElementById("file-view-"+id).classList.add("is--show")
                }}>
                    <EyeIcon/> <span>Voir</span>
                </button>
            </div>
            <div className='sigepec-info-file-preview-modal' id={"file-view-"+id}>
                <button className='sigepec-info-file-preview-modal__close' type='button' onClick={() => {
                        document.getElementById("file-view-"+id).classList.remove("is--show")
                }}>
                    <CancelIcon/>
                </button>
                <div className='sigepec-info-file-preview-modal__container'>
                    {
                        type === "pdf" ? (
                            <PDFViewer url={url}/>
                        ) : (

                            <img src={url} alt="file-preview" />
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default PreviewFile;