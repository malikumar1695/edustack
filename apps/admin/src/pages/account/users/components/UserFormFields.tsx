import { ProFormText } from "@ant-design/pro-components";

type props = {
    isEdit: boolean;
}

const UserFormFields = ({ isEdit }: props) => {


    return (
        <div>
            <ProFormText
                name="username"
                label="Username"
                placeholder="Enter username"
                width="md"
                disabled={isEdit}
                rules={[
                    { required: true, message: "Username is required" },
                    { min: 3, max: 64, message: "Username must be between 3 and 64 characters" },
                ]}
            />
            {!isEdit && (
                <ProFormText.Password
                    name="password"
                    label="Password"
                    placeholder="Enter password"
                    width="md"
                    rules={[
                        { required: true, message: "Password is required" },
                        { min: 8, message: "Password must be at least 8 characters" },
                    ]}
                />
            )
            }
        </div>
    );
};

export default UserFormFields;