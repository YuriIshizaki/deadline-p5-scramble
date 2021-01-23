export const scrambleModeTargetTextMaxlength = {
  main: 20,
  sub: 20
} as const;

export const scrambleModeTargetSettingDefault = {
  mainTarget: "",
  targets: ["", "", ""],
  others: {
    onTop: false
  }
};

export interface TargetOtherSettingInterface {
  onTop: boolean;
}

export interface TargetSettingInterface {
  mainTarget: string;
  targets: string[];
  others: TargetOtherSettingInterface;
}
