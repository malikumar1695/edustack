import { UploadOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProForm,
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useQuery } from '@tanstack/react-query';
import { Button, Input, message, Upload } from 'antd';
import React from 'react';
import { getCityOptions, provinceOptions } from '@/utils/chinaDivision';
import type { GeographicItemType } from '../data';
import { queryCity, queryCurrent, queryProvince } from '../service';
import useStyles from './index.style';

const validatorPhone = (
  _rule: any,
  value: string[],
  callback: (message?: string) => void,
) => {
  if (!value[0]) {
    callback('Please input your area code!');
  }
  if (!value[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

const toSelectValue = (item?: { label?: string; key?: string }) =>
  item?.key
    ? {
        label: item.label,
        value: item.key,
      }
    : undefined;

const toSelectOptions = (items: GeographicItemType[]) =>
  items
    .map((item) => {
      const label = item.name ?? item.label;
      const value = item.id ?? item.key;

      return label && value ? { label, value } : undefined;
    })
    .filter((item): item is { label: string; value: string } => Boolean(item));

const handleFinish = async () => {
  message.success('Basic information updated successfully');
};

const BaseView: React.FC = () => {
  const { styles } = useStyles();
  const formRef = React.useRef<ProFormInstance>(undefined);

  const handleValuesChange = (changedValues: Record<string, unknown>) => {
    if ('province' in changedValues) {
      formRef.current?.setFieldValue('city', undefined);
    }
  };

  const { data: currentUser, isLoading: loading } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => queryCurrent().then((res) => res.data),
  });
  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }
      const url =
        'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }
    return '';
  };
  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              formRef={formRef}
              layout="vertical"
              onFinish={handleFinish}
              onValuesChange={handleValuesChange}
              submitter={{
                searchConfig: {
                  submitText: 'Update Basic Information',
                },
                render: (_, dom) => dom[1],
              }}
              initialValues={{
                ...currentUser,
                province: toSelectValue(currentUser?.geographic?.province),
                city: toSelectValue(currentUser?.geographic?.city),
                phone: currentUser?.phone?.split('-'),
              }}
              requiredMark={false}
            >
              <ProFormText
                width="md"
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your email!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="name"
                label="Nickname"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your nickname!',
                  },
                ]}
              />
              <ProFormTextArea
                name="profile"
                label="Bio"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your bio!',
                  },
                ]}
                placeholder="Bio"
              />
              <ProFormSelect
                width="sm"
                name="country"
                label="Country/Region"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your country or region!',
                  },
                ]}
                options={[
                  {
                    label: 'China',
                    value: 'China',
                  },
                ]}
              />

              <ProForm.Group size={8}>
                <ProFormSelect
                  label="Province/City"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your province!',
                    },
                  ]}
                  width="sm"
                  fieldProps={{
                    labelInValue: true,
                  }}
                  name="province"
                  request={async () => {
                    const options = toSelectOptions(await queryProvince());
                    return options.length
                      ? options
                      : toSelectOptions(provinceOptions);
                  }}
                />
                <ProFormDependency name={['province']}>
                  {({ province }) => {
                    return (
                      <ProFormSelect
                        label=" "
                        params={{
                          key: province?.value,
                        }}
                        name="city"
                        width="sm"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter your city!',
                          },
                        ]}
                        fieldProps={{
                          labelInValue: true,
                        }}
                        disabled={!province}
                        request={async (params) => {
                          if (!params.key) {
                            return [];
                          }
                          const provinceKey = String(params.key);
                          const options = toSelectOptions(
                            await queryCity(provinceKey),
                          );
                          return options.length
                            ? options
                            : toSelectOptions(getCityOptions(provinceKey));
                        }}
                      />
                    );
                  }}
                </ProFormDependency>
              </ProForm.Group>
              <ProFormText
                width="md"
                name="address"
                label="Street Address"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your street address!',
                  },
                ]}
              />
              <ProFormFieldSet
                name="phone"
                label="Phone Number"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your phone number!',
                  },
                  {
                    validator: validatorPhone,
                  },
                ]}
              >
                <Input className={styles.area_code} />
                <Input className={styles.phone_number} />
              </ProFormFieldSet>
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} />
          </div>
        </>
      )}
    </div>
  );
};
export default BaseView;

const AvatarView = ({ avatar }: { avatar: string }) => {
  const { styles } = useStyles();

  return (
    <>
      <div className={styles.avatar_title}>Avatar</div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <Upload showUploadList={false}>
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            Change Avatar
          </Button>
        </div>
      </Upload>
    </>
  );
};
