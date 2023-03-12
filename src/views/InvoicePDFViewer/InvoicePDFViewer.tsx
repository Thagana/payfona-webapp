import * as React from "react";
import { useLocation } from "react-router-dom";
import TemplateWrapper from "../Template";
import { useNavigate } from "react-router-dom";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export default function InvoicePDFViewer() {
  const location = useLocation();
  const invoiceLink = location.state.url;
 
  const navigate = useNavigate();

  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
 
  React.useEffect(() => {
      openInNewTab(invoiceLink);
      navigate('/invoices');
  },[])
 
  return (
    <TemplateWrapper defaultIndex="1">
        <div />
    </TemplateWrapper>
  );
}
