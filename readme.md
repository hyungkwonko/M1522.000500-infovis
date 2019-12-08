# Infovisproj

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.1.

## TODO
* ������ �� ����
  * data.Notes �ȿ� �ִ� �� ��ǥ �����͸��� `State`��� ������Ƽ�� �߰��Ѵ�. �� �۾��� ������ ���� json ������ �ҷ��� ������ �� ���� ����ȴ�. `State`�� ���� `{ selected: true, hovered: false, playing: false }`(�ʱⰪ) ������Ʈ�̴�.
  * �� ��ǥ�� ��Ÿ���� �ð�ȭ �׸��� hover�� �� ȣ��Ǵ� �̺�Ʈ �Լ�����, �׸��� �� attr�� ���� �������� ���� ���� `State`���� `hovered = true;`�� �����Ѵ�. ���콺�� �� ��, �������� ��, ������ �������� ������ ���������̴�.
  * �� ��ǥ�� ������Ʈ�ϴ� D3 �������� attr�� ������ ��, `State` ���� ���� ���� �����Ѵ�.
  * ���� `hovered === true`�̸� �ٸ� �Ӽ��� ������� ���� ȣ���� ������ �ٲ۴�.
  * `hovered === false` �̰� `playing === true`�̸� `selected` ���� ������� ���� ��� ���� ������ �ٲ۴�.
  * `hovered === false` �̰� `playing === false`�̰� `selected === false`�̸� ���� ��� �帴�� ������ �ٲ۴�. `selected === true`�̸� ���� ������ �ٲ۴�.

* ��Ʈ ���� �߰�
  * velocity ������׷� -> "Note dynamics distribution"
  * position ������׷� -> "Note pitch distribution"
  * ������(6��) -> "Note pitch per time"
  * �� ��Ʈ(7��) -> "Note dynamics per time"
  * Stacked �� ��Ʈ -> "Note pitch class distribution"

* ��Ʈ ���� �߰� (Updated!)
  * velocity ������׷� -> ��Ⱑ � �������� ���εǾ� �ִ��� ǥ�� (�Ʒ��� '�� ����' ����)
  * position ������׷�, ������ -> ���� � ��(Note pitch class)�� ���εǾ� �ִ��� ǥ��
  * Stacked �� ��Ʈ -> ��Ⱑ � ��Ÿ�꿡 ���εǾ� �ִ��� grayscale�� ǥ��

* ��Ʈ �� �̸� �߰� (New!)
  * velocity ������׷� x��: "dynamics"
  * velocity ������׷� y��: "count"
  * position ������׷� x��: "pitch"
  * position ������׷� y��: "count"
  * ������(6��) x��: "time (s)" -> ������ �� ������ ǥ�� (�鸸���� ������)
  * ������(6��) y��: "pitch"
  * �� ��Ʈ(7��) x��: "time (s)" -> ������ �� ������ ǥ�� (�鸸���� ������)
  * �� ��Ʈ(7��) y��: "dynamics"

* ��� ��ġ ǥ��
  * ��� ��ġ�� �ٲ� ������ �ش� ��� ��ġ�� ���� ��ǥ���� `State` ���� ��� ��ġ�� �ƴϰ� �� ��ǥ���� `State` ���� �����Ѵ�.
  * ���� ���� bar ������� 6��, 7�� �ð�ȭ�� ��ο� �Ķ������� ǥ���Ѵ�.

* ��, ��� ����
  * Stacked �� ��Ʈ
    * �� bar�� Saturation�� 45%�� ����
    * �� bar�� Value�� ��Ÿ�꿡 ���� -1: 17.5% / 0: 25% / 1: 32.5% / 2: 40% / 3: 47.5% / 4: 55% / 5: 62.5% / 6: 70% / 7: 77.5% / 8: 85% / 9: 92.5% �� �ǵ���
    * �� bar�� Hue�� �� ������ ���� E = 0, A = 30, D = 60, G = 90, C = 120, F = 150, A# = 180, D# = 210, G# = 240, C# = 270, F# = 300, B = 330 �� �ǵ���
    * ȣ�� �� �׵θ��� ��ο� ���������� ǥ��
    * ���� �� �׵θ��� ��ο� ��������� ǥ��

  * velocity ������׷�, �� ��Ʈ(7��)
    * ���� Saturation�� 0%�� grayscale
    * velocity�� 20 ����: �� Value�� 20%, ���ʰ� ppp
    * velocity�� 21 �̻� 37 ����: �� Value�� 30%, ���ʰ� pp
    * velocity�� 38 �̻� 52 ����: �� Value�� 40%, ���ʰ� p
    * velocity�� 53 �̻� 67 ����: �� Value�� 50%, ���ʰ� mp
    * velocity�� 68 �̻� 83 ����: �� Value�� 60%, ���ʰ� mf
    * velocity�� 84 �̻� 100 ����: �� Value�� 70%, ���ʰ� f
    * velocity�� 101 �̻� 117 ����: �� Value�� 80%, ���ʰ� ff
    * velocity�� 118 �̻�: �� Value�� 90%, ���ʰ� fff
    * ȣ�� �� ���������� ǥ��
    * ���� �� ��������� ǥ��
    * �� ��Ʈ(7��)���� ��� ���� ��ǥ�� �ش��ϴ� �ٴ� �Ķ������� ǥ��

  * position ������׷�
    * ȣ�� �� ũ��(�β�)�� 3px�� Ŀ���� ���� �ǵ帮�� �ʱ�
    * ���� �� ũ��(�β�)�� 2px�� Ŀ���� ���� �ǵ帮�� �ʱ�

  * ������(6��)
    * �� ��ǥ�� �ձ� �簢������ ǥ��
    * ȣ�� �� �׵θ��� ��ο� ���������� ǥ��
    * ���� �� �׵θ��� ��ο� ��������� ǥ��
    * ��� ���� ��ǥ�� �ش��ϴ� ���� �׵θ��� ��ο� �Ķ������� ǥ��

* �� �� ����
  * "InfoVis term project" -> "Musical structure visualization system (Optimized for 1920x1080 screen)"


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).