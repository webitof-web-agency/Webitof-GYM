import { Form } from 'antd';
import { useRouter } from 'next/navigation';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import { postLanguage } from '../../../../helpers/backend';
import { useAction } from '../../../../helpers/hooks';
import FormSelect from '../../../../../components/form/select';
import Button from '../../../../../components/common/button';
import { useI18n } from '../../../../providers/i18n';
import { FiGlobe, FiCode, FiFlag, FiLayers, FiToggleRight, FiSave } from 'react-icons/fi';

const LanguageForm = ({ isEdit, form }) => {
    const i18n = useI18n();
    const { push } = useRouter()
    
    return (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center">
                      <FiGlobe size={16} />
                 </div>
                 <div>
                      <h3 className="text-base font-bold text-gray-800 leading-tight">Identity Parameters</h3>
                      <p className="text-[11px] text-gray-500 font-medium">Set the structural metadata for the new translation engine variant</p>
                 </div>
            </div>
            
             <Form form={form} layout="vertical" onFinish={(values) => {
                 return useAction(
                     values?._id ? postLanguage : postLanguage,
                     values, () => {
                         push('/admin/languages')
                     })
             }} className="p-6">
                 {
                     isEdit && <HiddenInput name="_id" />
                 }
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                     <div className="col-span-1 md:col-span-2">
                         <FormInput 
                            placeholder={("e.g. English, Español")} 
                            name="name" 
                            label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><FiGlobe size={12}/> Dialect Target Name</span>} 
                            required 
                         />
                     </div>
                     <div className="col-span-1">
                         <FormInput 
                            placeholder={("e.g. en, es")} 
                            name="code" 
                            label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><FiCode size={12}/> ISO Local Code</span>} 
                            required 
                         />
                     </div>
                     <div className="col-span-1">
                         <FormInput 
                            placeholder={("Emoji or URI")} 
                            name="flag" 
                            label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><FiFlag size={12}/> Global Icon Emoji</span>} 
                            required 
                         />
                     </div>
                     
                     <div className="col-span-1 pt-4 border-t border-slate-100">
                         <FormSelect 
                            placeholder={("Layout constraint")} 
                            name="rtl" 
                            label={<span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-1.5"><FiLayers size={11}/> Require RTL Flip</span>}
                             options={[
                                 { label: i18n?.t("Yes (Right-to-Left)"), value: true },
                                 { label: i18n?.t("No (Left-to-Right)"), value: false }
                             ]}
                         />
                     </div>
                     <div className="col-span-1 pt-4 border-t border-slate-100">
                         <FormSelect 
                             placeholder={("Select Status")} 
                             name="active" 
                             label={<span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-1.5"><FiToggleRight size={11}/> System Activation Status</span>}
                             options={[
                                 { label: i18n?.t("Online (Live)"), value: true },
                                 { label: i18n?.t("Offline (Hidden)"), value: false }
                             ]}
                         />
                     </div>
                 </div>

                 <div className="flex justify-end pt-5 mt-5 border-t border-slate-100">
                      <Button type='button' onClick={() => push('/admin/languages')} className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !px-6 !py-2 !font-semibold !rounded-lg !text-xs mr-2 transition-all">Cancel</Button>
                      <Button type='submit' className="!px-6 !py-2 flex items-center gap-1.5 shadow-md shadow-[#5572fc]/20 !font-semibold !rounded-lg !text-xs transition-all tracking-wide">
                          <FiSave size={14}/> {i18n?.t(isEdit ? "Update Translation Rules" : "Register Engine Code")}
                      </Button>
                 </div>
             </Form>
        </div>
    );
}

export default LanguageForm
