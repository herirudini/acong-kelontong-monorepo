import { Component } from '@angular/core';
import { ColumnProps, GenericTable } from '../../../shared/components/generic-table/generic-table';

@Component({
  selector: 'app-tables-simple',
  imports: [GenericTable],
  templateUrl: './tables-simple.html',
  styleUrl: './tables-simple.scss'
})
export class TablesSimple {
  list = [
    {
      id: 1,
      document_type: 'LICENSE' as any, // adjust based on your DocumentType enum/string
      file_upload: { id: 101, url: '/uploads/file1.pdf', name: 'License_1.pdf' } as any, // adjust FileUpload structure
      expiry_status: 'valid',
      document_number: 'DOC-001',
      site_id: 'SITE-001',
      site_address: '123 Main St, Jakarta',
      site_name: 'Headquarters',
      issuer: 'Gov Dept',
      document_date: '2025-01-01',
      document_validity: '2026-01-01',
      is_active: true,
    },
    {
      id: 2,
      document_type: 'PERMIT' as any,
      file_upload: { id: 102, url: '/uploads/file2.pdf', name: 'Permit_1.pdf' } as any,
      expiry_status: 'expired',
      document_number: 'DOC-002',
      site_id: 'SITE-002',
      site_address: '456 Second St, Bandung',
      site_name: 'Branch Office',
      issuer: 'Local Authority',
      document_date: '2023-05-10',
      document_validity: '2024-05-10',
      is_active: false,
    },
    {
      id: 3,
      document_type: 'CERTIFICATE' as any,
      file_upload: { id: 103, url: '/uploads/file3.pdf', name: 'Cert_1.pdf' } as any,
      expiry_status: 'pending',
      document_number: 'DOC-003',
      site_id: 'SITE-003',
      site_address: '789 Third St, Surabaya',
      site_name: 'Regional Office',
      issuer: 'Certification Body',
      document_date: '2025-03-15',
      document_validity: '2027-03-15',
      is_active: true,
    },
  ];


  genericColumns: { [key: string]: any } = {
    document_number: (id: string) => {
      return {
        label: 'DOCUMENT_NUMBER',
        id,
        sort: true,
        extraHeaderClass: 'uppercase-text',
        width: '210px',
      };
    },
    upload_date: (id: string) => {
      return {
        label: 'UPLOAD_DATE',
        id,
        sort: true,
        extraHeaderClass: 'uppercase-text',
        dataType: 'DATE'
      };
    },
    document_date: (id: string) => {
      return {
        label: 'DOCUMENT_DATE',
        id,
        sort: true,
        extraHeaderClass: 'uppercase-text',
        dataType: 'DATE'
      };
    },
    action: (id: string) => {
      return {
        label: 'ACTION',
        id,
        sort: false,
        extraHeaderClass: 'uppercase-text',
        customElementId: 'action',
      };
    },
    modified_by: (id: string) => {
      return {
        label: 'BY_EMAIL_SLASH_NAME',
        id,
        sort: true,
        extraHeaderClass: 'uppercase-text',
        width: '210px',
      };
    },
    ba_tera_issuer: (id: string) => {
      return {
        label: 'BA_TERA_ISSUER',
        id,
        sort: true,
        extraHeaderClass: 'uppercase-text',
        width: '210px',
      };
    },
    ba_tera_date: (id: string) => {
      return {
        label: 'BA_TERA_DATE',
        id,
        sort: true,
        extraHeaderClass: 'uppercase-text',
        width: '210px',
      };
    },
  };

   columns: Array<ColumnProps> = [
    this.genericColumns.document_number('document_number'),
    this.genericColumns.upload_date('file_upload.updated_at'),
    this.genericColumns.ba_tera_issuer('issuer'),
    this.genericColumns.ba_tera_date('document_date'),
    this.genericColumns.modified_by('modified_by'),
    this.genericColumns.action()
  ]

  // columns: (type: string) => Array<ColumnProps> = (type: string) => {
  //   return [
  //     [
  //       this.genericColumns.document_number('document_number'),
  //       this.genericColumns.upload_date('file_upload.updated_at'),
  //       this.genericColumns.document_date('document_date'),
  //       // this.genericColumns.document_validity('document_validity'),
  //     ],
  //     [
  //       this.genericColumns.document_number('document_number'),
  //       this.genericColumns.upload_date('file_upload.updated_at'),
  //       this.genericColumns.document_date('document_date'),
  //       this.genericColumns.modified_by('modified_by'),
  //     ],
  //     ...(type === 'dummy'
  //       ? [
  //         this.genericColumns.document_number('document_number'),
  //         this.genericColumns.upload_date('file_upload.updated_at'),
  //         this.genericColumns.ba_tera_issuer('issuer'),
  //         this.genericColumns.ba_tera_date('document_date'),
  //         this.genericColumns.modified_by('modified_by'),
  //       ]
  //       : []),
  //   ]
  // }
}
