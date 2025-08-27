// @ts-nocheck
import { Document, model, Schema } from 'mongoose';

export type PickupServiceSettingSubmoduleInputType = {
  service: {
    pickupToggle: {
      type: string;
      value: boolean;
    };
  };
};

export type WhatsappAutomationSettingSubmoduleInputType = {
  whatsapp: {
    buyer_processing: {
      type: string;
      value: boolean;
    };
    seller_processing: {
      type: string;
      value: boolean;
    };
    seller_publishing: {
      type: string;
      value: boolean;
    };
    dispute_message: {
      type: string;
      value: boolean;
    };
    seller_extension_whatsapp_message: {
      type: string;
      value: boolean;
    };
    seller_detection_nudge: {
      type: string;
      value: boolean;
    };
  };
};

export type OMStatusAutomationSettingInputType = {
  automation: {
    confirm_unavailable: {
      type: string;
      value: boolean;
    };
    refund: {
      type: string;
      value: boolean;
    };
    await_shipping_pickup: {
      type: string;
      value: boolean;
    };
    backlog_unshipped_orders: {
      type: string;
      value: boolean;
    };
    backlog_unpicked_up_orders: {
      type: string;
      value: boolean;
    };
    backlog_intransit_orders: {
      type: string;
      value: boolean;
    };
  };
};

export type CourierAutomationSettingInputType = {
  smsa: {
    automationToggle: {
      type: string;
      value: boolean;
    };
  };
};
export interface DeltaMachineSettingInput {
  id?: any;
  name?: string;
  description?: string;
  type?: string;
  setting_category?: string | string[];
  value?: any;
  possible_values?: any;
  status?: string;
  created_date?: Date;
  updated_date?: Date;
  deleted_date?: Date;
}

export interface DeltaMachineSettingDocument extends Document {
  id?: any;
  name: string;
  description?: string;
  type?: string;
  setting_category: string;
  value: any;
  possible_values?: any;
  status?: string;
  created_date?: Date;
  updated_date?: Date;
  deleted_date?: Date;
}

const settingDMOSchema = new Schema({
  name: { type: String },
  description: { type: String },
  type: {
    type: String,
    enum: ['number', 'string', 'boolean', 'option', 'json'],
  },
  setting_category: { type: String },
  value: { type: Schema.Types.Mixed, default: '' },
  possible_values: { type: Schema.Types.Mixed, default: '' },
  status: { type: String, default: 'Enabled' },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  deleted_date: { type: Date },
});

export const SettingDMO = model<DeltaMachineSettingDocument>(
  'DeltaMachineSetting',
  settingDMOSchema,
  'DeltaMachineSetting'
);
