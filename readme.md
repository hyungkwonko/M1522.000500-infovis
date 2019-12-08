# Infovisproj

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.1.

## TODO
* 데이터 모델 변경
  * data.Notes 안에 있는 각 음표 데이터마다 `State`라는 프로퍼티를 추가한다. 이 작업은 선택한 곡의 json 파일을 불러올 때마다 한 번씩 수행된다. `State`의 값은 `{ selected: true, hovered: false, playing: false }`(초기값) 오브젝트이다.
  * 각 음표를 나타내는 시각화 그림을 hover할 때 호출되는 이벤트 함수에서, 그림의 색 attr을 직접 변경하지 말고 위의 `State`에서 `hovered = true;`로 변경한다. 마우스를 뗄 때, 선택했을 때, 선택을 해제했을 때에도 마찬가지이다.
  * 각 음표를 업데이트하는 D3 로직에서 attr을 변경할 때, `State` 값을 보고 색을 결정한다.
  * 만약 `hovered === true`이면 다른 속성에 상관없이 색을 호버된 색으로 바꾼다.
  * `hovered === false` 이고 `playing === true`이면 `selected` 값에 상관없이 색을 재생 중인 색으로 바꾼다.
  * `hovered === false` 이고 `playing === false`이고 `selected === false`이면 색을 밝고 흐릿한 색으로 바꾼다. `selected === true`이면 원래 색으로 바꾼다.

* 차트 제목 추가
  * velocity 히스토그램 -> "Note dynamics distribution"
  * position 히스토그램 -> "Note pitch distribution"
  * 산점도(6번) -> "Note pitch per time"
  * 바 차트(7번) -> "Note dynamics per time"
  * Stacked 바 차트 -> "Note pitch class distribution"

* 차트 범례 추가 (Updated!)
  * velocity 히스토그램 -> 밝기가 어떤 셈여림에 매핑되어 있는지 표시 (아래의 '색 변경' 참조)
  * position 히스토그램, 산점도 -> 색이 어떤 음(Note pitch class)에 매핑되어 있는지 표시
  * Stacked 바 차트 -> 밝기가 어떤 옥타브에 매핑되어 있는지 grayscale로 표시

* 차트 축 이름 추가 (New!)
  * velocity 히스토그램 x축: "dynamics"
  * velocity 히스토그램 y축: "count"
  * position 히스토그램 x축: "pitch"
  * position 히스토그램 y축: "count"
  * 산점도(6번) x축: "time (s)" -> 단위를 초 단위로 표시 (백만으로 나누기)
  * 산점도(6번) y축: "pitch"
  * 바 차트(7번) x축: "time (s)" -> 단위를 초 단위로 표시 (백만으로 나누기)
  * 바 차트(7번) y축: "dynamics"

* 재생 위치 표시
  * 재생 위치가 바뀔 때마다 해당 재생 위치에 놓인 음표들의 `State` 값과 재생 위치가 아니게 된 음표들의 `State` 값을 변경한다.
  * 얇은 세로 bar 모양으로 6번, 7번 시각화에 어두운 파란색으로 표시한다.

* 색, 모양 변경
  * Stacked 바 차트
    * 각 bar의 Saturation이 45%로 고정
    * 각 bar의 Value가 옥타브에 따라 -1: 17.5% / 0: 25% / 1: 32.5% / 2: 40% / 3: 47.5% / 4: 55% / 5: 62.5% / 6: 70% / 7: 77.5% / 8: 85% / 9: 92.5% 로 되도록
    * 각 bar의 Hue가 음 종류에 따라 E = 0, A = 30, D = 60, G = 90, C = 120, F = 150, A# = 180, D# = 210, G# = 240, C# = 270, F# = 300, B = 330 이 되도록
    * 호버 시 테두리를 어두운 빨간색으로 표시
    * 선택 시 테두리를 어두운 보라색으로 표시

  * velocity 히스토그램, 바 차트(7번)
    * 전부 Saturation이 0%로 grayscale
    * velocity가 20 이하: 색 Value가 20%, 범례가 ppp
    * velocity가 21 이상 37 이하: 색 Value가 30%, 범례가 pp
    * velocity가 38 이상 52 이하: 색 Value가 40%, 범례가 p
    * velocity가 53 이상 67 이하: 색 Value가 50%, 범례가 mp
    * velocity가 68 이상 83 이하: 색 Value가 60%, 범례가 mf
    * velocity가 84 이상 100 이하: 색 Value가 70%, 범례가 f
    * velocity가 101 이상 117 이하: 색 Value가 80%, 범례가 ff
    * velocity가 118 이상: 색 Value가 90%, 범례가 fff
    * 호버 시 빨간색으로 표시
    * 선택 시 보라색으로 표시
    * 바 차트(7번)에서 재생 중인 음표에 해당하는 바는 파란색으로 표시

  * position 히스토그램
    * 호버 시 크기(두께)가 3px로 커지고 색은 건드리지 않기
    * 선택 시 크기(두께)가 2px로 커지고 색은 건드리지 않기

  * 산점도(6번)
    * 각 음표를 둥근 사각형으로 표시
    * 호버 시 테두리를 어두운 빨간색으로 표시
    * 선택 시 테두리를 어두운 보라색으로 표시
    * 재생 중인 음표에 해당하는 점은 테두리를 어두운 파란색으로 표시

* 맨 위 제목
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